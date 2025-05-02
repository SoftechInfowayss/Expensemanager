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
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be a number between 1 and 12' });
    }
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 9999) {
      return res.status(400).json({ error: 'Year must be a valid four-digit number' });
    }

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
    }).lean();

    if (!transactions.length) {
      return res.status(404).json({ error: `No transactions found for ${email} in ${month}/${year}` });
    }

    // Separate income and expenses
    const categorizedExpenses = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    // Process transactions
    for (let tx of transactions) {
      const cat = tx.name?.toLowerCase() || 'other';
      const amt = typeof tx.amount === 'number' ? tx.amount : 0;
      if (amt > 0) {
        if (tx.type === 'expense') {
          categorizedExpenses[cat] = (categorizedExpenses[cat] || 0) + amt;
          totalExpenses += amt;
        } else if (tx.type === 'income') {
          totalIncome += amt;
        }
      }
    }

    // Calculate expense breakdown
    const expenseBreakdown = Object.entries(categorizedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : 0
    }));

    // Prepare the prompt with both income and expense data
    const prompt = `
      Analyze this user's financial data for ${month}/${year} and suggest a budget allocation plan for that month.
      Input:
      - Total Income: $${totalIncome.toFixed(2)}
      - Total Expenses: $${totalExpenses.toFixed(2)}
      - Expense Breakdown by Category: ${JSON.stringify(expenseBreakdown, null, 2)}
      
      Instructions:
      1. Analyze the income and spending patterns for ${month}/${year}
      2. Suggest a revised budget allocation for the specified month based on income and expenses
      3. Recommend areas for potential savings
      4. Provide actionable advice tailored to the month's financial data
      
      Required JSON Response Format:
      {
        "recommendedBudget": [
          { "category": "Food", "amount": 300, "suggestion": "Reduce by 10%" },
          { "category": "Rent", "amount": 800, "suggestion": "Good amount" }
        ],
        "summary": "Your financial analysis for ${month}/${year} suggests...",
        "savingsTarget": "Aim to save 20% of your income",
        "actionableAdvice": ["Reduce dining out", "Cancel unused subscriptions"]
      }
      
      Critical Requirements:
      - Return ONLY valid JSON (no markdown, no code blocks)
      - Use double quotes for all properties and strings
      - No trailing commas
      - Escape special characters in strings
      - Include all required fields
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let rawResponse = result.response.text().trim();
    console.log('Raw Gemini Response:', rawResponse);

    // Enhanced response parsing
    const cleanJsonResponse = (jsonString) => {
      // Remove any markdown code blocks
      jsonString = jsonString.replace(/```(json)?/g, '');
      
      // Fix common JSON issues
      return jsonString
        .replace(/'/g, '"')
        .replace(/(\w+)\s*:/g, '"$1":')
        .replace(/:\s*([^"{}\[\],\s]+)(?=\s*[,}\]])/g, ': "$1"')
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/\\"/g, '"')
        .replace(/\n/g, ' ');
    };

    try {
      // First try parsing directly
      let budget = JSON.parse(rawResponse);
      
      // Validate response structure
      const requiredFields = ['recommendedBudget', 'summary', 'savingsTarget', 'actionableAdvice'];
      const missingFields = requiredFields.filter(field => !budget[field]);
      
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      return res.status(200).json(budget);
    } catch (initialError) {
      console.log('Initial parse failed, attempting cleaned parse...');
      
      try {
        const cleanedResponse = cleanJsonResponse(rawResponse);
        const budget = JSON.parse(cleanedResponse);
        
        // Validate cleaned response
        const requiredFields = ['recommendedBudget', 'summary', 'savingsTarget', 'actionableAdvice'];
        const missingFields = requiredFields.filter(field => !budget[field]);
        
        if (missingFields.length) {
          throw new Error(`Missing required fields after cleaning: ${missingFields.join(', ')}`);
        }
        
        return res.status(200).json(budget);
      } catch (finalError) {
        console.error('Final parse error:', finalError.message);
        console.error('Problematic response:', rawResponse);
        
        return res.status(500).json({
          error: 'Unable to parse Gemini response',
          details: finalError.message,
          rawResponse: rawResponse.substring(0, 500) + '...'
        });
      }
    }
  } catch (error) {
    console.error('Error generating budget suggestion:', error);
    res.status(500).json({
      error: 'Failed to generate budget suggestion',
      details: error.message
    });
  }
});

module.exports = router;