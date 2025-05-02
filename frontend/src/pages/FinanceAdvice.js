import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const FinancialAdvice = () => {
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      setError("Please log in to view financial advice.");
      setLoadingAdvice(false);
      return;
    }

    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/insights/advice?email=${email}`);
        setAdvice(response.data);
      } catch (error) {
        console.error("Error fetching financial advice:", error);
        setAdvice({
          advice: "Could not fetch financial advice at this time.",
          savingsGoal: "₹0",
          focusArea: "N/A",
          reductionPercentage: 0,
        });
        setError("Failed to load advice. Displaying default message.");
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [email]);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse top-0 left-0"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse bottom-0 right-0"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-gradient-to-b from-gray-800 to-gray-900">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Your Financial Insights
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 text-center mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Discover personalized advice to optimize your financial journey.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <motion.div
          className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loadingAdvice ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
              <p className="mt-6 text-xl text-gray-300">Analyzing your financial patterns...</p>
              <div className="mt-4 w-3/4 mx-auto h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </motion.div>
          ) : error && !advice ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-red-400 text-xl">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants}>
              <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-blue-300 mb-6">
                Personalized Recommendations
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-200 mb-8 leading-relaxed"
              >
                {advice?.advice || "No advice available."}
              </motion.p>
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                <motion.div
                  variants={itemVariants}
                  className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-600/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-gray-400">Focus Area</p>
                  <p className="font-semibold text-xl text-blue-300 mt-2">{advice?.focusArea || "N/A"}</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg text-center border border-gray-600/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-gray-400">Savings Goal</p>
                  <p className="font-semibold text-xl text-green-400 mt-2">{advice?.savingsGoal || "₹0"}</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-lg text-center border border_GRAY-600/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-gray-400">Reduce Spending By</p>
                  <p className="font-semibold text-xl text-red-400 mt-2">{advice?.reductionPercentage || 0}%</p>
                </motion.div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="mt-10 flex justify-center"
              >
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg transition-all duration-300 shadow-lg"
                >
                  Refresh Advice
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-300 text-lg">
            Explore more financial tools and insights on your{" "}
            <a href="/user/" className="text-blue-400 hover:underline font-semibold">
              Dashboard
            </a>
            .
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/user/"
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
            >
              View Dashboard
            </a>
            <a
              href="/transactions"
              className="bg-transparent border border-blue-400 hover:bg-blue-400/20 text-blue-400 py-2 px-6 rounded-lg transition-all duration-300"
            >
              Manage Transactions
            </a>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for loading animation */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default FinancialAdvice;
