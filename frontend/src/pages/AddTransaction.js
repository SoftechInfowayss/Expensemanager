import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LucidePlusCircle,
  LucideWallet,
  LucideArrowDownUp,
} from "lucide-react";

const AddTransactionPage = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // ✅ Default to today's date
  const [isLoading, setIsLoading] = useState(true);

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

    if (!name || !amount || !date) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/transactions/", {
        email,
        name,
        amount: parseFloat(amount),
        type,
        date,
      });

      toast.success("Transaction added successfully!");

      setName("");
      setAmount("");
      setType("income");
      setDate(new Date().toISOString().split("T")[0]); // Reset to today
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 relative overflow-hidden">
      {/* Background Animation Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/30 animate-gradient-bg"></div>
      {/* Optional Subtle Particle Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)] opacity-50 animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 bg-gray-800 border-b border-gray-700 relative z-10"
      >
        <h1 className="text-3xl font-bold text-blue-400">Add Transaction</h1>
      </motion.header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-8 relative z-10"
      >
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
            <span className="absolute top-3 left-3 text-gray-400" style={{ fontSize: '20px' }}>₹</span>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Transaction Type Selector */}
          <div className="relative mb-4">
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

          {/* Date Input */}
          <div className="relative mb-6">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
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

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick draggable />
    </div>
  );
};

export default AddTransactionPage;