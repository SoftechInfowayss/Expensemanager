// utils/insightsHelper.js

const getMonthlyStats = (transactions) => {
    const stats = {};
  
    transactions.forEach((txn) => {
      const month = new Date(txn.date).getMonth(); // 0 to 11
      if (!stats[month]) stats[month] = 0;
      stats[month] += txn.amount;
    });
  
    return stats;
  };
  
  const recommendBudget = (monthlyStats) => {
    const last3 = Object.values(monthlyStats).slice(-3);
    const avg = last3.reduce((a, b) => a + b, 0) / last3.length;
    return Math.round(avg * 0.9); // Recommend 10% less
  };
  
  const detectOverspending = (transactions, currentMonth) => {
    const categoryStats = {};
  
    transactions.forEach((txn) => {
      const month = new Date(txn.date).getMonth();
      if (!categoryStats[txn.category]) categoryStats[txn.category] = {};
      if (!categoryStats[txn.category][month]) categoryStats[txn.category][month] = 0;
  
      categoryStats[txn.category][month] += txn.amount;
    });
  
    const alerts = [];
  
    for (let category in categoryStats) {
      const months = Object.keys(categoryStats[category]);
      const current = categoryStats[category][currentMonth] || 0;
      const prev = months
        .filter((m) => m != currentMonth)
        .map((m) => categoryStats[category][m]);
  
      if (prev.length === 0) continue;
  
      const avg = prev.reduce((a, b) => a + b, 0) / prev.length;
      if (current > avg * 1.3) {
        alerts.push({
          category,
          message: `You've spent 30%+ more than usual in "${category}" this month.`,
        });
      }
    }
  
    return alerts;
  };
  
  module.exports = { getMonthlyStats, recommendBudget, detectOverspending };
  