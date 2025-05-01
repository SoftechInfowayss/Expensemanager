import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BudgetSuggestion = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      setError("Please log in to view budget suggestions.");
      setLoading(false);
      return;
    }

    const fetchBudgetSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/budget/suggestion?email=${email}`
        );
        setBudgetData(response.data);
      } catch (error) {
        console.error("Error fetching budget suggestions:", error);
        setError("Failed to load budget suggestions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetSuggestions();
  }, [email]);

  // Simplified animation variants to prevent errors
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-green-600/10 rounded-full filter blur-3xl animate-float top-[-300px] left-[-300px]"></div>
        <div className="absolute w-[800px] h-[800px] bg-teal-600/10 rounded-full filter blur-3xl animate-float bottom-[-300px] right-[-300px]"></div>
      </div>

      {/* Header */}
      <div className="relative pt-32 pb-20 text-center">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          Budget Suggestions
        </motion.h1>
        <motion.p
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Smart budget recommendations based on your spending patterns
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          className="bg-gray-800/20 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-700/10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin reverse"></div>
                </div>
                <p className="mt-8 text-xl sm:text-2xl text-gray-100 font-semibold">
                  Analyzing your spending patterns...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-red-400 text-xl sm:text-2xl font-semibold">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 px-10 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                >
                  Try Again
                </button>
              </motion.div>
            ) : budgetData ? (
              <motion.div key="content" variants={containerVariants}>
                <motion.div variants={itemVariants} className="mb-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-teal-300 mb-4">
                    Your Recommended Budget
                  </h2>
                  <p className="text-gray-200">
                    {budgetData.summary || "Here's our suggested budget allocation based on your spending patterns."}
                  </p>
                  {budgetData.savingsTarget && (
                    <div className="mt-4 p-4 bg-emerald-900/30 rounded-lg border border-emerald-700/50">
                      <p className="text-emerald-300 font-medium">
                        💰 Savings Target: {budgetData.savingsTarget}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Budget Table - Using CSS animations instead of Framer Motion */}
                <motion.div variants={itemVariants} className="mb-12">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-4 rounded-tl-xl">Category</th>
                          <th className="p-4">Recommended Amount</th>
                          <th className="p-4">Suggestion</th>
                          <th className="p-4 rounded-tr-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetData.recommendedBudget?.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b border-gray-700/30 transition-all duration-300 ${
                              index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'
                            } hover:bg-teal-900/10`}
                            style={{
                              animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                              opacity: 0
                            }}
                          >
                            <td className="p-4 font-medium text-teal-300">
                              {item.category}
                            </td>
                            <td className="p-4">${item.amount}</td>
                            <td className="p-4 text-gray-300">
                              {item.suggestion || "No specific suggestion"}
                            </td>
                            <td className="p-4">
                              <button className="text-sm bg-teal-600 hover:bg-teal-700 text-white py-1 px-3 rounded-lg transition-colors">
                                Apply
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Summary and Actions */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6"
                >
                  <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/20 flex-1 w-full">
                    <h3 className="text-xl font-semibold text-teal-300 mb-3">
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {budgetData.actionableAdvice?.map((advice, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          <span>{advice}</span>
                        </li>
                      )) || (
                        <li className="text-gray-400">
                          Review your budget categories for optimization
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                    >
                      Regenerate Suggestions
                    </button>
                    <button
                      className="bg-transparent border-2 border-teal-400 hover:bg-teal-400/10 text-teal-400 py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Save Budget
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="no-data"
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-gray-400 text-xl">
                  No budget data available. Please try again later.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.4; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin.reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default BudgetSuggestion;