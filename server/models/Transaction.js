const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    date: {
        type: Date,
        required: true // ✅ Now required from frontend
    }
}, {
    timestamps: true // Optional: Adds createdAt and updatedAt fields
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
