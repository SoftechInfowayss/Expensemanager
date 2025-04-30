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
          savingsGoal: "$0",
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

  // Animation variants
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
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.6, 0.05, 0.36, 0.95] },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)" },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans relative overflow-hidden">
      {/* Background Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full filter blur-3xl animate-float top-[-300px] left-[-300px]"></div>
        <div className="absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full filter blur-3xl animate-float bottom-[-300px] right-[-300px]"></div>
        <div className="absolute inset-0 particles"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 text-center">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Your Financial Insights
        </motion.h1>
        <motion.p
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Empower your financial future with tailored advice and actionable insights.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          className="bg-gray-800/20 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-700/10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {loadingAdvice ? (
              <motion.div
                key="loading"
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-purple-500 border-t-transparent rounded-full animate-spin reverse"></div>
                  <div className="absolute inset-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-xl sm:text-2xl text-gray-100 font-semibold">Crafting your financial strategy...</p>
                <div className="mt-8 w-80 mx-auto h-2 bg-gray-700/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-loading-bar"></div>
                </div>
              </motion.div>
            ) : error && !advice ? (
              <motion.div
                key="error"
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-red-400 text-xl sm:text-2xl font-semibold">{error}</p>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-10 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="content" variants={containerVariants}>
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl font-bold text-blue-300 mb-10"
                >
                  Personalized Recommendations
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-lg sm:text-xl text-gray-200 mb-12 leading-relaxed max-w-4xl"
                >
                  {advice?.advice || "No advice available."}
                </motion.p>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                >
                  {[
                    { label: "Focus Area", value: advice?.focusArea || "N/A", color: "text-blue-300", icon: "🎯" },
                    { label: "Savings Goal", value: advice?.savingsGoal || "$0", color: "text-green-400", icon: "💰" },
                    { label: "Reduce Spending By", value: `${advice?.reductionPercentage || 0}%`, color: "text-red-400", icon: "📉" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-gray-800/15 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-gray-700/20 hover:shadow-2xl transition-all duration-500 tilt-card"
                      whileHover={{ scale: 1.04, rotateX: 3, rotateY: 3, z: 10 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <p className="text-sm text-gray-400 font-medium tracking-wide">{item.label}</p>
                      <p className={`font-bold text-2xl ${item.color} mt-3`}>{item.value}</p>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="mt-12 sm:mt-16 flex justify-center"
                >
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-12 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Refresh Advice
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 sm:mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-2xl mx-auto">
            Dive deeper into your financial journey on your{" "}
            <a href="/user/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Dashboard
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <motion.a
              href="/user/"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-10 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              View Dashboard
            </motion.a>
            <motion.a
              href="/transactions"
              className="bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-400 py-3 px-10 rounded-xl font-semibold transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Manage Transactions
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.4; }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 3s ease-in-out infinite;
        }
        .animate-spin.reverse {
          animation-direction: reverse;
        }
        .particles {
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .tilt-card {
          transform-style: preserve-3d;
          transform: perspective(1000px);
        }
        .tilt-card:hover {
          transform: perspective(1000px) translateZ(20px);
        }
        html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 400;
          font-variation-settings: 'slnt' 0;
        }
        h1, h2, button, a {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default FinancialAdvice;