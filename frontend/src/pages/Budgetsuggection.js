import React, { useState, useEffect } from 'react';
import { FiPieChart, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const BudgetSuggestion = () => {
  const [budgetData, setBudgetData] = useState({
    monthlySummary: {
      month: 0,
      year: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0
    },
    budgetRecommendations: [],
    keyInsights: [],
    actionableAdvice: [],
    savingsOpportunities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchBudgetSuggestions = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem('email') ;
        const response = await fetch(
          `http://localhost:5000/api/budget/suggestion?email=${email}&month=${month}&year=${year}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget suggestions');
        }
        
        const data = await response.json();
        const safeData = {
          monthlySummary: data.monthlySummary || {
            month: 0,
            year: 0,
            totalIncome: 0,
            totalExpenses: 0,
            netSavings: 0
          },
          budgetRecommendations: data.budgetRecommendations || [],
          keyInsights: data.keyInsights || [],
          actionableAdvice: data.actionableAdvice || [],
          savingsOpportunities: data.savingsOpportunities || []
        };
        setBudgetData(safeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetSuggestions();
  }, [month, year]);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950 border-l-4 border-red-500 text-red-100 p-6 m-8 rounded-xl animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto">
        <p className="font-bold text-lg">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#0f172a] top-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-white mb-16 animate-[slideUp_1s_cubic-bezier(0.4,0,0.2,1)] bg-clip-text text-transparent bg-gradient-to-r from-[#1e40af] via-[#3b82f6] to-[#7c3aed] text-center tracking-wide text-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
    Budget Suggestions
  </h1>
        
        {/* Month/Year Selector */}
        <div className="flex items-center gap-4 mb-10 animate-[fadeIn_0.5s_ease-out] justify-center">
          <div className="flex items-center">
            <FiCalendar className="text-white mr-2" />
            <select 
              value={month}
              onChange={handleMonthChange}
              className="border-none bg-[#334155] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#60a5fa] transition-all duration-300 hover:bg-[#475569]"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1} className="bg-[#334155]">
                  {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <select 
            value={year}
            onChange={handleYearChange}
            className="border-none bg-[#334155] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#60a5fa] transition-all duration-300 hover:bg-[#475569]"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const yearOption = new Date().getFullYear() - 5 + i;
              return (
                <option key={yearOption} value={yearOption} className="bg-[#334155]">
                  {yearOption}
                </option>
              );
            })}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Total Income', value: budgetData.monthlySummary.totalIncome, color: 'text-green-400' },
            { title: 'Total Expenses', value: budgetData.monthlySummary.totalExpenses, color: 'text-red-400' },
            { title: 'Balance', value: budgetData.monthlySummary.netSavings, color: 'text-[#3b82f6]' }
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:scale-105 transition-transform duration-300 animate-[fadeIn_0.5s_ease-out]"
            >
              <h3 className="text-gray-300 text-sm font-medium">{card.title}</h3>
              <p className={`text-2xl font-bold ${card.color}`}>
                ₹{card.value?.toLocaleString() || '0'}
              </p>
            </div>
          ))}
        </div>

        {/* Budget Recommendations */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl mb-10 hover:scale-[1.02] transition-transform duration-300 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-xl font-bold text-white mb-4">Budget Recommendations</h2>
          <div className="space-y-4">
            {budgetData.budgetRecommendations?.length > 0 ? (
              budgetData.budgetRecommendations.map((item, index) => (
                <div key={index} className="border-b border-[#1e3a8a] pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white capitalize">{item.category || 'Uncategorized'}</h3>
                      <p className="text-sm text-gray-300">{item.suggestion || 'No suggestion provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Current: ₹{item.currentSpending || '0'}</p>
                      <p className={`font-medium ${(item.adjustmentPercentage || 0) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        Recommended: ₹{item.recommendedBudget || '0'} ({item.adjustmentPercentage || '0'}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No budget recommendations available</p>
            )}
          </div>
        </div>

        {/* Insights and Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">Key Insights</h2>
            <ul className="space-y-2">
              {budgetData.keyInsights?.length > 0 ? (
                budgetData.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-[#3b82f6] rounded-full mt-2 mr-2"></span>
                    <span className="text-gray-200">{insight}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No insights available</p>
              )}
            </ul>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">Actionable Advice</h2>
            <ul className="space-y-2">
              {budgetData.actionableAdvice?.length > 0 ? (
                budgetData.actionableAdvice.map((advice, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-2 mr-2"></span>
                    <span className="text-gray-200">{advice}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No advice available</p>
              )}
            </ul>
          </div>
        </div>

        {/* Savings Opportunities */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-xl font-bold text-white mb-4">Savings Opportunities</h2>
          <div className="flex flex-wrap gap-2">
            {budgetData.savingsOpportunities?.length > 0 ? (
              budgetData.savingsOpportunities.map((opportunity, index) => (
                <span 
                  key={index} 
                  className="bg-[#2563eb] text-white px-3 py-1 rounded-full text-sm hover:bg-[#3b82f6] transition-colors duration-300"
                >
                  {opportunity}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No savings opportunities identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSuggestion;