import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});
  const [openMonth, setOpenMonth] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvice, setShowAdvice] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`https://expensebackend-production.up.railway.app/api/transactions?email=${email}`);
        setTransactions(res.data);
        calculateStats(res.data);

        const monthlyRes = await axios.get(`http://localhost:5000/api/transactions/summary/monthly?email=${email}`);
        setMonthlyData(monthlyRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [email]);

  const getFinancialAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/insights/advice?email=${email}`);
      setAdvice(response.data);
      setShowAdvice(true);
    } catch (error) {
      console.error("Error fetching financial advice:", error);
      setAdvice({
        advice: "Could not fetch financial advice at this time.",
        savingsGoal: "$0",
        focusArea: "N/A",
        reductionPercentage: 0
      });
      setShowAdvice(true);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const calculateStats = (data) => {
    let totalIncome = 0;
    let totalExpense = 0;
    const currentMonth = new Date().getMonth();

    data.forEach((item) => {
      const itemMonth = new Date(item.date).getMonth();
      if (itemMonth === currentMonth) {
        if (item.type === "income") totalIncome += item.amount;
        else totalExpense += item.amount;
      }
    });

    setIncome(totalIncome);
    setExpenses(totalExpense);
    setBalance(totalIncome - totalExpense);
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}?email=${email}`);
      const res = await axios.get(`https://expensebackend-production.up.railway.app/api/transactions?email=${email}`);
      setTransactions(res.data);
      calculateStats(res.data);
      const monthlyRes = await axios.get(`http://localhost:5000/api/transactions/summary/monthly?email=${email}`);
      setMonthlyData(monthlyRes.data);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const currentMonthTransactions = transactions.filter(t => {
    const txnMonth = new Date(t.date).toLocaleString('default', { month: 'long' });
    return txnMonth === currentMonth;
  });

  const filteredTransactions = currentMonthTransactions.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const barData = currentMonthTransactions.map((t) => ({
    name: t.name,
    amount: t.amount,
  }));

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white pt-24">
      <AnimatePresence>
        {showAdvice && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-400">Financial Advice</h3>
                <button 
                  onClick={() => setShowAdvice(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {loadingAdvice ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4">Analyzing your spending patterns...</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg mb-4">{advice?.advice || "No advice available."}</p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Focus Area</p>
                      <p className="font-semibold">{advice?.focusArea || "N/A"}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Savings Goal</p>
                      <p className="font-semibold text-green-400">{advice?.savingsGoal || "$0"}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Reduce By</p>
                      <p className="font-semibold">{advice?.reductionPercentage || 0}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdvice(false)}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h2 
        className="text-3xl font-bold text-center mb-6 text-blue-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Dashboard
        <button
          onClick={getFinancialAdvice}
          className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-normal transition"
          title="Get financial advice"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 -mt-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Advice
        </button>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-green-400">Total Income</h3>
          <p className="text-2xl font-bold">${income}</p>
        </motion.div>

        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-red-400">Total Expenses</h3>
          <p className="text-2xl font-bold">${expenses}</p>
        </motion.div>

        <motion.div 
          className="bg-gray-800 p-6 rounded-lg shadow-md text-center"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-semibold text-blue-400">Balance</h3>
          <p className="text-2xl font-bold">${balance}</p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses ({currentMonth})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transaction Overview ({currentMonth})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="amount" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions ({currentMonth})</h3>
        <input 
          type="text" 
          placeholder="Search Transactions..." 
          className="w-full p-2 mb-4 rounded-md text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="overflow-auto max-h-60">
          {filteredTransactions.map((t) => (
            <div key={t._id} className="flex justify-between items-center border-b border-gray-600 py-2">
              <span>{t.name}</span>
              <div className="flex items-center">
                <span className={t.type === "income" ? "text-green-400" : "text-red-400"}>${t.amount}</span>
                <button
                  onClick={() => deleteTransaction(t._id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                  title="Delete transaction"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Transactions Summary</h3>
        {Object.entries(monthlyData).map(([month, data]) => (
          <div key={month} className="mb-6">
            <button
              onClick={() => setOpenMonth(openMonth === month ? null : month)}
              className="w-full text-left text-2xl font-bold text-blue-300 mb-2"
            >
              {month}
            </button>
            <AnimatePresence>
              {openMonth === month && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-400">Income: ${data.income}</p>
                      <p className="text-red-400">Expenses: ${data.expense}</p>
                      <div className="overflow-auto max-h-60 mt-4">
                        {data.transactions.map((txn) => (
                          <div key={txn._id} className="flex justify-between items-center border-b border-gray-600 py-2">
                            <span>{txn.name}</span>
                            <div className="flex items-center">
                              <span className={txn.type === "income" ? "text-green-400" : "text-red-400"}>${txn.amount}</span>
                              <button
                                onClick={() => deleteTransaction(txn._id)}
                                className="ml-4 text-red-500 hover:text-red-700"
                                title="Delete transaction"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie data={[{ name: "Income", value: data.income }, { name: "Expenses", value: data.expense }]} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                              <Cell fill="#4CAF50" />
                              <Cell fill="#F44336" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[{ name: 'Income', value: data.income }, { name: 'Expenses', value: data.expense }]}> 
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3498db" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;