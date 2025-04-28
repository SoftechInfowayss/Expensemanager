// // Updated Code with gpt-3.5-turbo model and improvements

// const express = require("express");
// const router = express.Router();
// // const { OpenAI } = require("openai");
// const Transaction = require("../models/Transaction");

// require("dotenv").config(); // Ensure environment variables are loaded first

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Check if the key loaded properly
// if (!OPENAI_API_KEY) {
//   console.error("Error: OPENAI_API_KEY not found in environment variables.");
// }

// const openai = new OpenAI({
//   apiKey: OPENAI_API_KEY,
// });

// // Fetch monthly summary based on user's email
// const getMonthlySummary = async (email) => {
//   try {
//     const transactions = await Transaction.find({ email }).sort({ date: -1 });

//     const monthlySummary = {};

//     transactions.forEach((txn) => {
//       const date = new Date(txn.date);
//       const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

//       if (!monthlySummary[yearMonth]) {
//         monthlySummary[yearMonth] = {
//           income: 0,
//           expense: 0,
//         };
//       }

//       if (txn.type === "income") {
//         monthlySummary[yearMonth].income += txn.amount;
//       } else if (txn.type === "expense") {
//         monthlySummary[yearMonth].expense += txn.amount;
//       }
//     });

//     return monthlySummary;
//   } catch (error) {
//     throw new Error('Failed to fetch transaction summary: ' + error.message);
//   }
// };

// // POST route to generate finance tips
// router.post("/finance-tips", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const monthlySummary = await getMonthlySummary(email);

//     if (!monthlySummary || Object.keys(monthlySummary).length === 0) {
//       return res.status(404).json({ message: "No transactions found for the provided email" });
//     }

//     const summaryText = Object.entries(monthlySummary)
//       .map(([yearMonth, data]) => `For ${yearMonth}: Income = $${data.income}, Expense = $${data.expense}.`)
//       .join("\n");

//     const prompt = `
//     You are a financial advisor. Based on the user's monthly financial summary:

//     ${summaryText}

//     Suggest personalized financial tips, advice to save money, and recommendations for better budgeting.
//     `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Changed from gpt-4 to gpt-3.5-turbo
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//       max_tokens: 300,
//     });

//     const tip = response.choices[0].message.content;

//     return res.status(200).json({ message: "Finance tip generated successfully", tip });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Something went wrong", error: error.message });
//   }
// });

// module.exports = router;
