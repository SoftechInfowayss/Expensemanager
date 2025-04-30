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

router.get('/advice', async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email parameter
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    // Fetch expense transactions for the user
    const transactions = await Transaction.find({ email, type: 'expense' }).lean();
    if (!transactions.length) {
      return res.status(404).json({ error: 'No expense transactions found for this user' });
    }

    // Validate and prepare transaction data
    const transactionDetails = transactions
      .map(t => ({
        name: t.name || 'Unknown',
        amount: typeof t.amount === 'number' ? t.amount : 0,
        date: t.date || new Date()
      }))
      .filter(t => t.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    if (!transactionDetails.length) {
      return res.status(404).json({ error: 'No valid expense transactions found for this user' });
    }

    const totalSpent = transactionDetails.reduce((sum, t) => sum + t.amount, 0);
    console.log('Transaction Details:', transactionDetails);

    // Prompt for Gemini API
    const prompt = `
      Based on the following financial data, provide personalized financial advice as a raw JSON object:
      - Total spent: $${totalSpent.toFixed(2)}
      - Transaction details: ${JSON.stringify(transactionDetails)}
      Analyze the transaction names and amounts to identify spending patterns or frequent expenses.
      Suggest ways to save money, including a specific percentage reduction for the highest spending transaction or pattern.
      Return ONLY a raw JSON object (do NOT wrap in markdown, code blocks like \\\`json, or extra text) with these exact fields: 
      {
        "advice": "string", 
        "savingsGoal": "string", 
        "focusArea": "string", 
        "reductionPercentage": number
      }.
      Example: 
      {
        "advice": "Reduce Uber rides by 20%", 
        "savingsGoal": "$10", 
        "focusArea": "Uber rides", 
        "reductionPercentage": 20
      }
      Important: Ensure the response is valid JSON with proper double quotes and no trailing commas.
    `;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let rawResponse = result.response.text().trim();
    console.log('Raw Gemini Response:', rawResponse);

    // Improved response cleaning
    try {
      // First try to parse directly in case it's already valid JSON
      let advice = JSON.parse(rawResponse);
      
      // Validate required fields
      const requiredFields = ['advice', 'savingsGoal', 'focusArea', 'reductionPercentage'];
      const missingFields = requiredFields.filter(field => !(field in advice));
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate reductionPercentage
      if (typeof advice.reductionPercentage !== 'number' || isNaN(advice.reductionPercentage)) {
        throw new Error('reductionPercentage must be a valid number');
      }

      return res.status(200).json(advice);
    } catch (parseError) {
      console.log('Initial parse failed, attempting to clean response...');
      
      // If direct parse fails, try cleaning
      try {
        // Remove markdown code blocks if present
        rawResponse = rawResponse.replace(/^(json)?|$/g, '').trim();
        
        // Fix common JSON issues
        // 1. Replace single quotes with double quotes
        rawResponse = rawResponse.replace(/'/g, '"');
        // 2. Remove trailing commas
        rawResponse = rawResponse.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        // 3. Ensure keys are quoted
        rawResponse = rawResponse.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
        
        console.log('Cleaned response:', rawResponse);
        
        const advice = JSON.parse(rawResponse);
        
        // Validate the cleaned response
        const requiredFields = ['advice', 'savingsGoal', 'focusArea', 'reductionPercentage'];
        const missingFields = requiredFields.filter(field => !(field in advice));
        if (missingFields.length) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (typeof advice.reductionPercentage !== 'number' || isNaN(advice.reductionPercentage)) {
          throw new Error('reductionPercentage must be a valid number');
        }

        return res.status(200).json(advice);
      } catch (cleanError) {
        console.error('Failed to clean and parse response:', cleanError);
        throw new Error(`Unable to parse Gemini response: ${cleanError.message}`);
      }
    }
  } catch (error) {
    console.error('Error generating financial advice:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate financial advice', 
      details: error.message 
    });
  }
});

module.exports = router;