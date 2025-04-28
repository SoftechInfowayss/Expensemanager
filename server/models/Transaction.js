const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    email: { type: String, required: true },  // Add this field
    name: String,
    amount: Number,
    type: { type: String, enum: ["income", "expense"] },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
