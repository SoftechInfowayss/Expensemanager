const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// ➤ Add Transaction (Income/Expense)
router.post("/", async (req, res) => {
    try {
        const { name, amount, type, email, date } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!date) return res.status(400).json({ message: "Date is required" });

        const transactionDate = new Date(date);
        const startOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
        const endOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0, 23, 59, 59);

        // Find an existing transaction for same name, type, email, and same month
        const existingTransaction = await Transaction.findOne({
            email,
            name,
            type,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        if (existingTransaction) {
            // Add to existing transaction amount
            existingTransaction.amount += amount;
            await existingTransaction.save();
            return res.status(200).json({ message: "Transaction updated", transaction: existingTransaction });
        } else {
            // Create new transaction
            const newTransaction = new Transaction({ name, amount, type, email, date });
            await newTransaction.save();
            return res.status(201).json({ message: "Transaction added", transaction: newTransaction });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// ➤ Get All Transactions for Logged-in User
router.get("/", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const transactions = await Transaction.find({ email }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Get Transactions by Type (Income or Expense) for Logged-in User
router.get("/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }

        const transactions = await Transaction.find({ email, type }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Update a Transaction (Only if it belongs to the logged-in user)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, type, email, date } = req.body; // ✅ Added `date`
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!date) return res.status(400).json({ message: "Date is required" });

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, email },
            { name, amount, type, date }, // ✅ Include `date` in update
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found or not authorized" });
        }

        res.json({ message: "Transaction updated", transaction: updatedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Delete a Transaction (Only if it belongs to the logged-in user)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, email });

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found or not authorized" });
        }

        res.json({ message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ➤ Get Transactions Grouped by Month for Logged-in User
router.get("/summary/monthly", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const transactions = await Transaction.find({ email }).sort({ date: -1 });

        const monthlySummary = {};

        transactions.forEach((txn) => {
            const date = new Date(txn.date);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (!monthlySummary[yearMonth]) {
                monthlySummary[yearMonth] = {
                    income: 0,
                    expense: 0,
                    transactions: []
                };
            }

            if (txn.type === "income") {
                monthlySummary[yearMonth].income += txn.amount;
            } else if (txn.type === "expense") {
                monthlySummary[yearMonth].expense += txn.amount;
            }

            monthlySummary[yearMonth].transactions.push(txn);
        });

        res.json(monthlySummary);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
