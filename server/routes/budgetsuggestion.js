const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const Transaction = require('../models/Transaction');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  throw new Error('GEMINI_API_KEY is required');
}

router.get('/suggestion', async (req, res) => {
  try {
    const { email, month, year } = req.query;
    
    // Validate query parameters
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });
    if (!month || !year) return res.status(400).json({ error: 'Month and year query parameters are required' });
    
    // Validate month and year format
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (isNaN(monthNum)) return res.status(400).json({ error: 'Month must be a number' });
    if (monthNum < 1 || monthNum > 12) return res.status(400).json({ error: 'Month must be between 1 and 12' });
    if (isNaN(yearNum)) return res.status(400).json({ error: 'Year must be a number' });
    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    // Rest of your code remains the same...
    // Calculate date range for the specified month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    // Fetch all transactions (income and expense) for the specified month
    const transactions = await Transaction.find({
      email,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 }).lean(); // Sort by date for better analysis

    if (!transactions.length) {
      return res.status(404).json({ 
        error: `No transactions found for ${email} in ${month}/${year}`,
        suggestion: 'Try a different month or add transactions first'
      });
    }

    // Process transactions
    const categorizedExpenses = {};
    const categorizedIncome = {};
    let totalExpenses = 0;
    let totalIncome = 0;
    const allCategories = new Set();

    transactions.forEach(tx => {
      const category = tx.category?.toLowerCase() || tx.name?.toLowerCase() || 'other';
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

    // Calculate expense breakdown with percentages
    const expenseBreakdown = Object.entries(categorizedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0.00'
    }));

    // Calculate income breakdown
    const incomeBreakdown = Object.entries(categorizedIncome).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : '0.00'
    }));

    // Prepare the prompt with transaction context
    const prompt = `
      Analyze this user's financial data for ${monthNum}/${yearNum} and provide specific, actionable budgeting advice ONLY for this month.

      User's Financial Snapshot:
      - Total Income: $${totalIncome.toFixed(2)}
      - Total Expenses: $${totalExpenses.toFixed(2)}
      - Savings: $${(totalIncome - totalExpenses).toFixed(2)}
      - Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2) : '0.00'}%

      Income Breakdown:
      ${incomeBreakdown.map(i => `- ${i.category}: $${i.amount} (${i.percentage}%)`).join('\n')}

      Expense Breakdown:
      ${expenseBreakdown.map(e => `- ${e.category}: $${e.amount} (${e.percentage}%)`).join('\n')}

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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // Parse and validate the response
    try {
      // First clean the response
      let jsonString = rawResponse.replace(/```json|```/g, '').trim();
      
      // Parse the JSON
      const budgetPlan = JSON.parse(jsonString);
      
      // Validate the response structure
      if (!budgetPlan.budgetRecommendations || !Array.isArray(budgetPlan.budgetRecommendations)) {
        throw new Error('Invalid response format: missing budgetRecommendations array');
      }
      
      // Validate that all recommended categories exist in the original data
      const invalidCategories = budgetPlan.budgetRecommendations.filter(rec => 
        !categorizedExpenses[rec.category.toLowerCase()]
      );
      
      if (invalidCategories.length > 0) {
        console.warn('Gemini recommended categories not found in transactions:', invalidCategories);
        // Filter out invalid categories
        budgetPlan.budgetRecommendations = budgetPlan.budgetRecommendations.filter(rec => 
          categorizedExpenses[rec.category.toLowerCase()]
        );
      }
      
      // Add month/year context to the response
      budgetPlan.monthContext = {
        month: monthNum,
        year: yearNum,
        analyzedCategories: Array.from(allCategories)
      };
      
      return res.status(200).json(budgetPlan);
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Problematic response:', rawResponse);
      
      // Fallback response if parsing fails
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
          recommendedBudget: expense.amount * 0.9, // Default 10% reduction
          suggestion: 'Consider reducing this expense by 10% next month',
          adjustmentPercentage: -10
        })),
        keyInsights: [
          `Your total expenses were $${totalExpenses.toFixed(2)} against income of $${totalIncome.toFixed(2)}`,
          `You spent ${((totalExpenses / totalIncome) * 100).toFixed(2)}% of your income`,
          `Main expenses were: ${expenseBreakdown.slice(0, 3).map(e => e.category).join(', ')}`
        ],
        actionableAdvice: [
          'Review your top 3 spending categories for potential reductions',
          'Set specific budget limits for next month based on this month\'s spending',
          'Consider tracking daily expenses to identify small savings opportunities'
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