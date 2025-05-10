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
          const category = tx.category?.toLowerCase() || tx.name?.toLowerCase() || 'other';
          categorizedExpenses[category] = (categorizedExpenses[category] || 0) + amount;
          totalExpenses += amount;
          
          // Track frequent expenses
          frequentExpenses[tx.name] = (frequentExpenses[tx.name] || 0) + 1;
        }
      }
    });

    // Get top expense categories
    const topExpenses = Object.entries(categorizedExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Get most frequent expenses
    const mostFrequent = Object.entries(frequentExpenses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    // Prepare the prompt with transaction context
    const prompt = `
      Analyze this user's expense data for ${monthNum}/${yearNum} and provide specific financial advice.
      Focus only on suggesting practical ways to reduce expenses with these exact 4 fields in JSON format:
      - advice: A short actionable advice (1 sentence)
      - savingsGoal: A specific savings target amount with currency symbol
      - focusArea: The main category/expense to focus on
      - reductionPercentage: A realistic percentage to reduce (5-30%)

      Expense Data:
      - Total Expenses: ₹${totalExpenses.toFixed(2)}
      - Top Categories: ${topExpenses.map(([cat, amt]) => `${cat} (₹${amt.toFixed(2)})`).join(', ')}
      - Frequent Expenses: ${mostFrequent.map(([name, count]) => `${name} (${count}x)`).join(', ')}

      Response Requirements:
      1. Return ONLY raw JSON with the 4 specified fields
      2. No additional text or markdown
      3. Use double quotes for all properties and strings
      4. Example format:
      {
        "advice": "Reduce eating out by cooking more at home",
        "savingsGoal": "₹2000",
        "focusArea": "Restaurants",
        "reductionPercentage": 15
      }
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    // Parse and validate the response
    try {
      // Clean the response
      let jsonString = rawResponse.replace(/```json|```/g, '').trim();
      
      // Parse the JSON
      const advice = JSON.parse(jsonString);
      
      // Validate required fields
      const requiredFields = ['advice', 'savingsGoal', 'focusArea', 'reductionPercentage'];
      const missingFields = requiredFields.filter(field => !(field in advice));
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate reductionPercentage is a reasonable number
      const percentage = parseInt(advice.reductionPercentage);
      if (isNaN(percentage) || percentage < 5 || percentage > 30) {
        advice.reductionPercentage = 10; // Default to 10% if invalid
      }

      // Add month/year context (hidden in response but useful for debugging)
      advice._context = {
        month: monthNum,
        year: yearNum,
        totalExpenses
      };

      return res.status(200).json(advice);
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Problematic response:', rawResponse);
      
      // Fallback response if parsing fails
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

module.exports = router;