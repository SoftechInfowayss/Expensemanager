const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management API
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction (Income/Expense)
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, amount, type, email, date]
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               email:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction added or updated
 *       400:
 *         description: Missing email or date
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
    try {
        const { name, amount, type, email, date } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!date) return res.status(400).json({ message: "Date is required" });

        const transactionDate = new Date(date);
        const startOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1);
        const endOfMonth = new Date(transactionDate.getFullYear(), transactionDate.getMonth() + 1, 0, 23, 59, 59);

        const existingTransaction = await Transaction.findOne({
            email,
            name,
            type,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (existingTransaction) {
            existingTransaction.amount += amount;
            await existingTransaction.save();
            return res.status(200).json({ message: "Transaction updated", transaction: existingTransaction });
        } else {
            const newTransaction = new Transaction({ name, amount, type, email, date });
            await newTransaction.save();
            return res.status(201).json({ message: "Transaction added", transaction: newTransaction });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for a user
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email
 *     responses:
 *       200:
 *         description: List of transactions
 *       400:
 *         description: Email required
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/transactions/{type}:
 *   get:
 *     summary: Get transactions by type (income/expense)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of filtered transactions
 *       400:
 *         description: Invalid type or missing email
 */
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *               email:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, type, email, date } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!date) return res.status(400).json({ message: "Date is required" });

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, email },
            { name, amount, type, date },
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

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Not found
 */
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

/**
 * @swagger
 * /api/transactions/summary/monthly:
 *   get:
 *     summary: Get monthly summary grouped by income & expense
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Monthly summary
 */
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
