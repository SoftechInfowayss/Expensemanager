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
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    const transactions = await Transaction.find({ email, type: 'expense' }).lean();
    if (!transactions.length) return res.status(404).json({ error: 'No expense transactions found for this user' });

    const categorized = {};
    let total = 0;

    // Process transactions
    for (let tx of transactions) {
      const cat = tx.name?.toLowerCase() || 'other';
      const amt = typeof tx.amount === 'number' ? tx.amount : 0;
      if (amt > 0) {
        categorized[cat] = (categorized[cat] || 0) + amt;
        total += amt;
      }
    }

    const breakdown = Object.entries(categorized).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / total) * 100).toFixed(2)
    }));

    const prompt = `
      Analyze this user's monthly expenses by category and suggest a budget allocation plan.
      Input:
      - Total Spending: $${total.toFixed(2)}
      - Breakdown by Category: ${JSON.stringify(breakdown, null, 2)}
      
      Instructions:
      1. Analyze the spending patterns
      2. Suggest a revised monthly budget allocation
      3. Recommend areas for potential savings
      4. Provide actionable advice
      
      Required JSON Response Format:
      {
        "recommendedBudget": [
          { "category": "Food", "amount": 300, "suggestion": "Reduce by 10%" },
          { "category": "Rent", "amount": 800, "suggestion": "Good amount" }
        ],
        "summary": "Your spending analysis suggests...",
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
        .replace(/'/g, '"') // Replace single quotes
        .replace(/(\w+)\s*:/g, '"$1":') // Wrap unquoted keys
        .replace(/:\s*([^"{}\[\],\s]+)(?=\s*[,}\]])/g, ': "$1"') // Wrap unquoted values
        .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
        .replace(/\\"/g, '"') // Fix escaped quotes
        .replace(/\n/g, ' '); // Remove newlines
    };

    try {
      // First try parsing directly
      let budget = JSON.parse(rawResponse);
      
      // Validate response structure
      const requiredFields = ['recommendedBudget', 'summary', 'savingsTarget'];
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
        const requiredFields = ['recommendedBudget', 'summary', 'savingsTarget'];
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
          rawResponse: rawResponse.substring(0, 500) + '...' // Truncated for security
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