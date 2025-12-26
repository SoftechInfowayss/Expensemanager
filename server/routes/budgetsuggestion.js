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

// Preferred models (order = preference). Set GEMINI_MODEL in .env to override first choice.
const PREFERRED_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
  'text-bison-001'
].filter(Boolean);

// Toggle to true to print the complete raw model response (useful for debugging only)
const DEBUG_LOG_RAW_MODEL_RESPONSE = false;

// Retry/backoff config for REST fallback
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 500;

function normalizeModelId(alias) {
  if (!alias) return alias;
  return alias.startsWith('models/') ? alias : `models/${alias}`;
}

function fetchFnOrNodeFetch() {
  if (globalThis.fetch) return globalThis.fetch;
  try {
    // runtime require to avoid crash when not needed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('node-fetch');
  } catch (e) {
    throw new Error('No fetch available. Run on Node 18+ or install node-fetch.');
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
 * Uses the documented "contents" + "parts" JSON shape and x-goog-api-key header.
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
      // Retry transient statuses
      if ([429, 500, 502, 503, 504].includes(resp.status) && attempt < MAX_RETRIES) {
        const delay = jitterDelay(attempt);
        console.warn(`REST generateContent for ${modelId} returned ${resp.status}. retry ${attempt + 1} after ${delay}ms`);
        await sleep(delay);
        continue;
      }

      throw new Error(`REST generateContent failed: ${resp.status} ${resp.statusText} - ${text}`);
    } catch (err) {
      // network/fetch error - retry if attempts remain
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
 * Try SDK generateContent first (structured request). If SDK fails, try REST with retries.
 * Tries each model in modelsToTry list.
 * Returns { source: 'sdk'|'rest', model: <modelId>, result: <sdkOrRestResult> }
 */
async function generateWithFallbackModels(modelsToTry, prompt) {
  const errors = [];
  for (const alias of modelsToTry) {
    const modelId = normalizeModelId(alias);

    // SDK attempt
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
      // continue to REST fallback for this model
    }

    // REST fallback with retries
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

/**
 * Extract textual content from SDK or REST result (various shapes).
 * Accepts either the wrapper { source, model, result } or raw result from SDK/REST.
 */
function extractModelText(genResultWrapperOrRaw) {
  try {
    if (!genResultWrapperOrRaw) return '';

    // If wrapper with source/model/result
    if (genResultWrapperOrRaw.source && genResultWrapperOrRaw.result) {
      const { source, result } = genResultWrapperOrRaw;
      if (source === 'rest') {
        const rr = result;
        // Try common REST shapes
        if (rr?.candidates && Array.isArray(rr.candidates) && rr.candidates[0]?.content?.parts) {
          return rr.candidates[0].content.parts.map(p => p.text || '').join(' ').trim();
        } else if (rr?.candidates && Array.isArray(rr.candidates) && rr.candidates[0]?.content?.text) {
          return (rr.candidates[0].content.text || '').trim();
        } else if (rr?.output && Array.isArray(rr.output) && rr.output[0]?.content) {
          return rr.output[0].content.map(c => c.text || '').join('\n').trim();
        } else {
          // fallback: stringify
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
          return sdkRes.candidates[0].message.content.map(c => c.text || '').join(' ').trim();
        } else if (typeof sdkRes === 'string') {
          return sdkRes.trim();
        } else {
          return JSON.stringify(sdkRes).slice(0, 10000);
        }
      }
    }

    // If raw result directly passed
    const r = genResultWrapperOrRaw;
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
    return String(genResultWrapperOrRaw).slice(0, 10000);
  }
}

/* ------------------------- ROUTE: /suggestion ------------------------- */
router.get('/suggestion', async (req, res) => {
  try {
    const { email, month, year } = req.query;

    // Basic validation
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

    // Aggregate transactions
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

    // Build prompt
    const prompt = `
Analyze this user's financial data for ${monthNum}/${yearNum} and provide specific, actionable budgeting advice ONLY for this month.

User's Financial Snapshot:
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Savings: ₹${(totalIncome - totalExpenses).toFixed(2)}
- Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2) : '0.00'}%

Income Breakdown:
${incomeBreakdown.length ? incomeBreakdown.map(i => `- ${i.category}: ₹${i.amount.toFixed(2)} (${i.percentage}%)`).join('\n') : '- none'}

Expense Breakdown:
${expenseBreakdown.length ? expenseBreakdown.map(e => `- ${e.category}: ₹${e.amount.toFixed(2)} (${e.percentage}%)`).join('\n') : '- none'}

Specific Instructions:
1. Focus ONLY on the month ${monthNum}/${yearNum}
2. Analyze spending patterns in relation to income
3. Suggest budget adjustments ONLY for categories that appear in the expense breakdown
4. Provide concrete savings recommendations based on actual spending
5. Highlight concerning spending patterns (if any)
6. Suggest realistic adjustments (do not recommend fully eliminating categories)

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

    // Generate using fallback models (sdk -> rest per model)
    let genResult;
    try {
      genResult = await generateWithFallbackModels(PREFERRED_MODELS, prompt);
      if (DEBUG_LOG_RAW_MODEL_RESPONSE) {
        console.log('DEBUG raw model response (suggestion):', JSON.stringify(genResult, null, 2));
      }
      console.log(`Model used for /suggestion: ${genResult.model} via ${genResult.source}`);
    } catch (modelErr) {
      console.error('Model generation error (suggestion):', modelErr);
      return res.status(502).json({
        error: 'Model generation failed',
        details: modelErr.message,
        suggestion: 'Check GEMINI_MODEL or call ListModels to see available models for your API key'
      });
    }

    // Extract textual response
    const rawResponse = extractModelText(genResult);

    // Parse and validate the response
    try {
      let jsonString = rawResponse.replace(/```json|```/g, '').trim();

      // Extract first complete JSON object if extra text exists
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.slice(firstBrace, lastBrace + 1);
      }

      const budgetPlan = JSON.parse(jsonString);

      if (!budgetPlan.budgetRecommendations || !Array.isArray(budgetPlan.budgetRecommendations)) {
        throw new Error('Invalid response format: missing budgetRecommendations array');
      }

      // Validate categories exist in original data (case-insensitive)
      budgetPlan.budgetRecommendations = budgetPlan.budgetRecommendations.filter(rec => {
        if (!rec || !rec.category) return false;
        const lower = rec.category.toString().toLowerCase();
        return Object.prototype.hasOwnProperty.call(categorizedExpenses, lower);
      });

      // Add month context
      budgetPlan.monthContext = {
        month: monthNum,
        year: yearNum,
        analyzedCategories: Array.from(allCategories)
      };

      // Ensure numeric fields are numbers (not strings)
      budgetPlan.budgetRecommendations = budgetPlan.budgetRecommendations.map(rec => ({
        ...rec,
        currentSpending: Number(rec.currentSpending) || 0,
        recommendedBudget: Number(rec.recommendedBudget) || 0,
        adjustmentPercentage: Number(rec.adjustmentPercentage) || 0
      }));

      return res.status(200).json(budgetPlan);
    } catch (parseError) {
      console.error('Failed to parse model response (suggestion):', parseError);
      console.error('Problematic response (suggestion):', rawResponse);

      // Fallback plan (10% reduction default)
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
          currentSpending: Number(expense.amount),
          recommendedBudget: Math.round(expense.amount * 0.9 * 100) / 100,
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
        _warning: 'Default budget plan generated due to AI parsing/formatting issues',
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
