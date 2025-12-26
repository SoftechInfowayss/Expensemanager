// routes/financialAdvice.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const Transaction = require('../models/Transaction');

const router = express.Router();

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Which model(s) to try. Order = preference.
// You can set GEMINI_MODEL in .env to prefer a specific model first.
const PREFERRED_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
  'text-bison-001'
].filter(Boolean);

// Toggle this to true to print one full raw model response for debugging
const DEBUG_LOG_RAW_MODEL_RESPONSE = false;

// Retry configuration for REST fallback
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 500; // initial backoff base

function normalizeModelId(alias) {
  if (!alias) return alias;
  return alias.startsWith('models/') ? alias : `models/${alias}`;
}

function fetchFnOrNodeFetch() {
  if (globalThis.fetch) return globalThis.fetch;
  try {
    // require at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('node-fetch');
  } catch (e) {
    throw new Error('No fetch available (install node-fetch or run on Node 18+).');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jitterDelay(attempt) {
  const exp = Math.pow(2, attempt) * BASE_DELAY_MS;
  const jitter = Math.floor(Math.random() * BASE_DELAY_MS);
  return Math.min(15000, exp + jitter);
}

/**
 * REST generateContent with retries for transient errors (429/5xx).
 * Uses contents.parts shape and x-goog-api-key header.
 */
async function restGenerateContentWithRetries(modelAlias, prompt) {
  const modelId = normalizeModelId(modelAlias); // e.g. models/gemini-2.5-flash
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelId}:generateContent`;
  const fetchFn = fetchFnOrNodeFetch();

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body)
      });

      if (resp.ok) {
        return await resp.json();
      }

      const text = await resp.text().catch(() => '<no-body>');
      if ([429, 500, 502, 503, 504].includes(resp.status) && attempt < MAX_RETRIES) {
        const delay = jitterDelay(attempt);
        console.warn(`REST generateContent for ${modelId} returned ${resp.status}. retry ${attempt + 1} after ${delay}ms`);
        await sleep(delay);
        continue;
      }

      throw new Error(`REST generateContent failed: ${resp.status} ${resp.statusText} - ${text}`);
    } catch (err) {
      // network or fetch error
      if (attempt < MAX_RETRIES) {
        const delay = jitterDelay(attempt);
        console.warn(`REST network/error for ${modelId}, retry ${attempt + 1} after ${delay}ms`, err?.message || err);
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }

  throw new Error('REST generateContent exhausted retries');
}

/**
 * Try SDK generateContent first (structured request). If that fails, try REST with retries.
 * Returns an object: { source: 'sdk'|'rest', model: 'models/..', result: <sdk or rest json> }
 * Throws if all models in modelsToTry fail.
 */
async function generateWithFallbackModels(modelsToTry, prompt) {
  const errors = [];
  for (const alias of modelsToTry) {
    const modelId = normalizeModelId(alias);

    // 1) Try SDK
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const sdkRequest = {
        input: [
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }]
          }
        ]
      };

      const sdkResult = await model.generateContent(sdkRequest);
      return { source: 'sdk', model: modelId, result: sdkResult };
    } catch (sdkErr) {
      console.warn(`SDK generateContent failed for ${modelId}:`, sdkErr?.message || sdkErr);
      errors.push({ model: modelId, sdkErr: sdkErr?.message || String(sdkErr) });
    }

    // 2) REST fallback with retries
    try {
      const restResult = await restGenerateContentWithRetries(alias, prompt);
      return { source: 'rest', model: modelId, result: restResult };
    } catch (restErr) {
      console.warn(`REST generateContent failed for ${modelId}:`, restErr?.message || restErr);
      errors.push({ model: modelId, restErr: restErr?.message || String(restErr) });
      // try next model
    }
  }

  const err = new Error('All model attempts failed');
  err.details = errors;
  throw err;
}

/* ------------------------- Utility: extract text from result ------------------------- */
/**
 * Attempt to extract the textual response from different possible SDK/REST shapes.
 * Returns string (possibly empty).
 */
function extractModelText(genResponse) {
  try {
    // If the wrapper we returned earlier
    if (!genResponse) return '';

    // If it's our wrapper { source, model, result }
    if (genResponse.source && genResponse.result) {
      const { source, result } = genResponse;
      if (source === 'rest') {
        const rr = result;
        // common rest shapes:
        if (rr?.candidates && Array.isArray(rr.candidates) && rr.candidates[0]?.content?.parts) {
          return rr.candidates[0].content.parts.map(p => p.text || '').join(' ').trim();
        } else if (rr?.candidates && Array.isArray(rr.candidates) && rr.candidates[0]?.content?.text) {
          return (rr.candidates[0].content.text || '').trim();
        } else if (rr?.output && Array.isArray(rr.output) && rr.output[0]?.content) {
          return rr.output[0].content.map(c => c.text || '').join('\n').trim();
        } else if (rr?.response && rr.response?.output) {
          // defensive
          return JSON.stringify(rr).slice(0, 10000);
        } else {
          return JSON.stringify(rr).slice(0, 10000);
        }
      } else {
        // source === 'sdk'
        const sdkRes = result;
        if (sdkRes?.response && typeof sdkRes.response.text === 'function') {
          return sdkRes.response.text().trim();
        } else if (Array.isArray(sdkRes?.output) && sdkRes.output[0]?.content) {
          return sdkRes.output[0].content.filter(c => c?.text).map(c => c.text).join('\n').trim();
        } else if (sdkRes?.candidates && Array.isArray(sdkRes.candidates) && sdkRes.candidates[0]?.message?.content) {
          const contentArray = sdkRes.candidates[0].message.content;
          return contentArray.map(c => c.text || '').join(' ').trim();
        } else if (typeof sdkRes === 'string') {
          return sdkRes.trim();
        } else {
          return JSON.stringify(sdkRes).slice(0, 10000);
        }
      }
    }

    // If called directly with SDK/REST result without wrapper
    const r = genResponse;
    if (r?.response && typeof r.response.text === 'function') {
      return r.response.text().trim();
    } else if (r?.candidates && Array.isArray(r.candidates) && r.candidates[0]?.content?.parts) {
      return r.candidates[0].content.parts.map(p => p.text || '').join(' ').trim();
    } else if (Array.isArray(r?.output) && r.output[0]?.content) {
      return r.output[0].content.map(c => c.text || '').join('\n').trim();
    } else if (typeof r === 'string') {
      return r.trim();
    } else {
      return JSON.stringify(r).slice(0, 10000);
    }
  } catch (e) {
    return String(genResponse).slice(0, 10000);
  }
}

/* ------------------------- ROUTE: /advice ------------------------- */
router.get('/advice', async (req, res) => {
  try {
    const { email, month, year } = req.query;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });
    if (!month || !year) return res.status(400).json({ error: 'Month and year query parameters are required' });

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    if (isNaN(monthNum)) return res.status(400).json({ error: 'Month must be a number' });
    if (monthNum < 1 || monthNum > 12) return res.status(400).json({ error: 'Month must be between 1 and 12' });
    if (isNaN(yearNum)) return res.status(400).json({ error: 'Year must be a number' });
    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      email,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();

    if (!transactions.length) {
      return res.status(404).json({
        error: `No transactions found for ${email} in ${monthNum}/${yearNum}`,
        suggestion: 'Try a different month or add transactions first'
      });
    }

    // Process transactions
    const categorizedExpenses = {};
    let totalExpenses = 0;
    const frequentExpenses = {};

    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        const amount = parseFloat(tx.amount) || 0;
        if (amount > 0) {
          const category = (tx.category || tx.name || 'other').toString().toLowerCase();
          categorizedExpenses[category] = (categorizedExpenses[category] || 0) + amount;
          totalExpenses += amount;
          frequentExpenses[tx.name || category] = (frequentExpenses[tx.name || category] || 0) + 1;
        }
      }
    });

    const topExpenses = Object.entries(categorizedExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const mostFrequent = Object.entries(frequentExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    const prompt = `
Analyze this user's expense data for ${monthNum}/${yearNum} and provide specific financial advice.
Focus only on suggesting practical ways to reduce expenses with these exact 4 fields in JSON format:
- advice: A short actionable advice (1 sentence)
- savingsGoal: A specific savings target amount with currency symbol
- focusArea: The main category/expense to focus on
- reductionPercentage: A realistic percentage to reduce (5-30%)

Expense Data:
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Top Categories: ${topExpenses.map(([cat, amt]) => `${cat} (₹${amt.toFixed(2)})`).join(', ') || 'none'}
- Frequent Expenses: ${mostFrequent.map(([name, count]) => `${name} (${count}x)`).join(', ') || 'none'}

Response Requirements:
1. Return ONLY raw JSON with the 4 specified fields
2. No additional text or markdown
3. Use double quotes for all properties and strings
4. Example format:
{
  "advice": "Reduce eating out by cooking more at home",
  "savingsGoal": "₹2000",
  "focusArea": "restaurants",
  "reductionPercentage": 15
}
    `;

    // Generate using the preferred model list (tries each model with sdk -> rest)
    let genResult;
    try {
      genResult = await generateWithFallbackModels(PREFERRED_MODELS, prompt);
      if (DEBUG_LOG_RAW_MODEL_RESPONSE) {
        console.log('DEBUG raw model response (advice):', JSON.stringify(genResult, null, 2));
      }
      console.log(`Model used for /advice: ${genResult.model} via ${genResult.source}`);
    } catch (modelErr) {
      console.error('Model generation error (advice):', modelErr);
      return res.status(502).json({
        error: 'Model generation failed',
        details: modelErr.message,
        suggestion: 'Check GEMINI_MODEL or call ListModels to see available models for your API key'
      });
    }

    // Extract textual response from model result
    const rawResponse = extractModelText(genResult);

    // Parse and validate the response
    try {
      let jsonString = rawResponse.replace(/```json|```/g, '').trim();

      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.slice(firstBrace, lastBrace + 1);
      }

      const advice = JSON.parse(jsonString);

      const requiredFields = ['advice', 'savingsGoal', 'focusArea', 'reductionPercentage'];
      const missingFields = requiredFields.filter(field => !(field in advice));
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const percentage = parseInt(advice.reductionPercentage, 10);
      if (isNaN(percentage) || percentage < 5 || percentage > 30) {
        advice.reductionPercentage = 10;
      }

      advice._context = { month: monthNum, year: yearNum, totalExpenses };

      return res.status(200).json(advice);
    } catch (parseError) {
      console.error('Failed to parse model response (advice):', parseError);
      console.error('Problematic response (advice):', rawResponse);

      // Fallback advice
      return res.status(200).json({
        advice: `Review your top expenses in ${topExpenses[0]?.[0] || 'main'} category for potential savings`,
        savingsGoal: `₹${Math.round(totalExpenses * 0.1)}`,
        focusArea: topExpenses[0]?.[0] || 'your main expenses',
        reductionPercentage: 10,
        _warning: 'Default advice generated due to AI parsing issues'
      });
    }

  } catch (error) {
    console.error('Error in financial advice endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate financial advice',
      details: error.message
    });
  }
});

/* ------------------------- ROUTE: /suggestion ------------------------- */
router.get('/suggestion', async (req, res) => {
  try {
    const { email, month, year } = req.query;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });
    if (!month || !year) return res.status(400).json({ error: 'Month and year query parameters are required' });

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    if (isNaN(monthNum)) return res.status(400).json({ error: 'Month must be a number' });
    if (monthNum < 1 || monthNum > 12) return res.status(400).json({ error: 'Month must be between 1 and 12' });
    if (isNaN(yearNum)) return res.status(400).json({ error: 'Year must be a number' });
    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      email,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).lean();

    if (!transactions.length) {
      return res.status(404).json({
        error: `No transactions found for ${email} in ${month}/${year}`,
        suggestion: 'Try a different month or add transactions first'
      });
    }

    const categorizedExpenses = {};
    const categorizedIncome = {};
    let totalExpenses = 0;
    let totalIncome = 0;
    const allCategories = new Set();

    transactions.forEach(tx => {
      const category = (tx.category || tx.name || 'other').toString().toLowerCase();
      const amount = parseFloat(tx.amount) || 0;

      if (tx.type === 'expense' && amount > 0) {
        categorizedExpenses[category] = (categorizedExpenses[category] || 0) + amount;
        totalExpenses += amount;
        allCategories.add(category);
      } else if (tx.type === 'income' && amount > 0) {
        categorizedIncome[category] = (categorizedIncome[category] || 0) + amount;
        totalIncome += amount;
      }
    });

    const expenseBreakdown = Object.entries(categorizedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0.00'
    }));

    const incomeBreakdown = Object.entries(categorizedIncome).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : '0.00'
    }));

    const prompt = `
Analyze this user's financial data for ${monthNum}/${yearNum} and provide specific, actionable budgeting advice ONLY for this month.

User's Financial Snapshot:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Savings: ₹${(totalIncome - totalExpenses).toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2) : '0.00'}%

Income Breakdown:
${incomeBreakdown.map(i => `- ${i.category}: ₹${i.amount.toFixed(2)} (${i.percentage}%)`).join('\n') || '- none'}

Expense Breakdown:
${expenseBreakdown.map(e => `- ${e.category}: ₹${e.amount.toFixed(2)} (${e.percentage}%)`).join('\n') || '- none'}

Specific Instructions:
1. Focus ONLY on the month ${monthNum}/${yearNum}
2. Analyze spending patterns in relation to income
3. Suggest specific budget adjustments ONLY for categories that appear in the expense breakdown
4. Provide concrete savings recommendations based on actual spending
5. Highlight any concerning spending patterns
6. Suggest realistic adjustments (don't recommend completely eliminating categories)

Required JSON Response Format:
{
  "monthlySummary": {
    "month": ${monthNum},
    "year": ${yearNum},
    "totalIncome": ${totalIncome},
    "totalExpenses": ${totalExpenses},
    "netSavings": ${totalIncome - totalExpenses}
  },
  "budgetRecommendations": [
    {
      "category": "category_name_from_transactions",
      "currentSpending": 250,
      "recommendedBudget": 200,
      "suggestion": "Specific actionable advice for this category",
      "adjustmentPercentage": -20
    }
  ],
  "keyInsights": ["list of 3-5 key insights about this month's spending"],
  "actionableAdvice": ["list of 3-5 specific actions for next month"],
  "savingsOpportunities": ["list of potential savings opportunities"]
}

Critical Requirements:
- Only recommend adjustments for categories that exist in the expense breakdown
- All numbers must be based on the provided data
- Return ONLY valid JSON (no markdown, no code blocks)
- Use double quotes for all properties and strings
- No trailing commas
- Escape special characters in strings
    `;

    // Generate using the preferred model list (tries each model with sdk -> rest)
    let genResult2;
    try {
      genResult2 = await generateWithFallbackModels(PREFERRED_MODELS, prompt);
      if (DEBUG_LOG_RAW_MODEL_RESPONSE) {
        console.log('DEBUG raw model response (suggestion):', JSON.stringify(genResult2, null, 2));
      }
      console.log(`Model used for /suggestion: ${genResult2.model} via ${genResult2.source}`);
    } catch (modelErr) {
      console.error('Model generation error (suggestion):', modelErr);
      return res.status(502).json({
        error: 'Model generation failed',
        details: modelErr.message,
        suggestion: 'Check GEMINI_MODEL or call ListModels to see available models for your API key'
      });
    }

    // Extract textual response
    const rawResponse = extractModelText(genResult2);

    try {
      let jsonString = rawResponse.replace(/```json|```/g, '').trim();
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.slice(firstBrace, lastBrace + 1);
      }

      const budgetPlan = JSON.parse(jsonString);

      if (!budgetPlan.budgetRecommendations || !Array.isArray(budgetPlan.budgetRecommendations)) {
        throw new Error('Invalid response format: missing budgetRecommendations array');
      }

      // Filter recommendations to categories that exist
      budgetPlan.budgetRecommendations = budgetPlan.budgetRecommendations.filter(rec =>
        rec.category && categorizedExpenses.hasOwnProperty(rec.category.toLowerCase())
      );

      budgetPlan.monthContext = {
        month: monthNum,
        year: yearNum,
        analyzedCategories: Array.from(allCategories)
      };

      return res.status(200).json(budgetPlan);
    } catch (parseError) {
      console.error('Failed to parse model response (suggestion):', parseError);
      console.error('Problematic response (suggestion):', rawResponse);

      return res.status(200).json({
        monthlySummary: {
          month: monthNum,
          year: yearNum,
          totalIncome,
          totalExpenses,
          netSavings: totalIncome - totalExpenses
        },
        budgetRecommendations: expenseBreakdown.map(expense => ({
          category: expense.category,
          currentSpending: expense.amount,
          recommendedBudget: Math.round(expense.amount * 0.9 * 100) / 100, // 10% reduction
          suggestion: 'Consider reducing this expense by 10% next month',
          adjustmentPercentage: -10
        })),
        keyInsights: [
          `Your total expenses were ₹${totalExpenses.toFixed(2)} against income of ₹${totalIncome.toFixed(2)}`,
          `You saved ₹${(totalIncome - totalExpenses).toFixed(2)} this month`,
          `Main expenses were: ${expenseBreakdown.slice(0, 3).map(e => e.category).join(', ')}`
        ],
        actionableAdvice: [
          'Review your top 3 spending categories for potential reductions',
          'Set specific budget limits for next month based on this month\'s spending',
          'Track daily expenses to identify small savings opportunities'
        ],
        _warning: 'Default budget plan generated due to AI parsing issues',
        _originalError: parseError.message
      });
    }

  } catch (error) {
    console.error('Error in budget suggestion endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate budget suggestion',
      details: error.message,
      suggestion: 'Please try again with different parameters'
    });
  }
});

module.exports = router;
