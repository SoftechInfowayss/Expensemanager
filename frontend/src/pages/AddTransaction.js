import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LucidePlusCircle,
  LucideDollarSign,
  LucideWallet,
  LucideArrowDownUp,
} from "lucide-react";

const AddTransactionPage = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTransaction = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("User not logged in.");
      return;
    }

    if (!name || !amount) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://expensebackend-production.up.railway.app/api/transactions", {
        email,
        name,
        amount: parseFloat(amount),
        type,
      });

      toast.success("Transaction added successfully!");

      // Clear input fields
      setName("");
      setAmount("");
      setType("income");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 bg-gray-800 border-b border-gray-700"
      >
        <h1 className="text-3xl font-bold text-blue-400">Add Transaction</h1>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-8"
      >
        {/* Transaction Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Add New Transaction</h2>

          {/* Name Input */}
          <div className="relative mb-4">
            <LucideWallet className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Transaction Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Amount Input */}
          <div className="relative mb-4">
            <LucideDollarSign className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Transaction Type Selector */}
          <div className="relative mb-6">
            <LucideArrowDownUp className="absolute top-3 left-3 text-gray-400" size={20} />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Add Transaction Button */}
          <motion.button
            onClick={handleAddTransaction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg flex items-center justify-center space-x-2"
          >
            <LucidePlusCircle size={22} />
            <span className="text-lg font-semibold">Add Transaction</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Toast Messages */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick draggable />
    </div>
  );
};

export default AddTransactionPage;