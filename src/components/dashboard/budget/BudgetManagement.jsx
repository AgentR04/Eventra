import { useState } from "react";
import {
  FaWallet,
  FaReceipt,
  FaBalanceScale,
  FaChartPie,
  FaCalculator,
  FaExchangeAlt,
  FaChartBar,
  FaHandHoldingUsd,
  FaMoneyBillWave,
  FaPiggyBank,
  FaRegLightbulb
} from "react-icons/fa";

const BudgetManagement = ({ 
  budgetAllocations = [], 
  committees = [], 
  expenses = [], 
  incomes = [] 
}) => {
  const [budgetView, setBudgetView] = useState("overview"); // 'overview', 'expenses', 'income', 'allocation'
  const [showBudgetAISuggestions, setShowBudgetAISuggestions] = useState(false);
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null);
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState("monthly"); // 'weekly', 'monthly', 'overall'
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateRemainingBudget = () => {
    return calculateTotalIncome() - calculateTotalExpenses();
  };

  const calculateExpensesByCategory = () => {
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });

    // Convert to array with colors
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return Object.keys(categories).map((name, index) => ({
      name,
      value: categories[name],
      color: colors[index % colors.length]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Budget Management Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaWallet className="text-primary mr-2" />
              Budget Management & Tracking
            </h3>
            <p className="text-gray-600 mt-1">
              Monitor expenses, income, and allocations with AI insights
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                budgetView === "overview"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setBudgetView("overview")}
            >
              <FaChartPie className="mr-1" /> Overview
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                budgetView === "expenses"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setBudgetView("expenses")}
            >
              <FaReceipt className="mr-1" /> Expenses
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                budgetView === "income"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setBudgetView("income")}
            >
              <FaMoneyBillWave className="mr-1" /> Income
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                budgetView === "allocation"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setBudgetView("allocation")}
            >
              <FaExchangeAlt className="mr-1" /> Allocation
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={() => setShowBudgetAISuggestions(!showBudgetAISuggestions)}
            >
              <FaRegLightbulb className="mr-1 text-yellow-500" /> AI Insights
            </button>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      {budgetView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <FaWallet className="text-green-500 mr-2" />
                Total Income
              </h4>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                All Sources
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(calculateTotalIncome())}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              From {incomes.length} income sources
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <FaReceipt className="text-red-500 mr-2" />
                Total Expenses
              </h4>
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                All Categories
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(calculateTotalExpenses())}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              From {expenses.length} expense entries
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <FaBalanceScale className="text-blue-500 mr-2" />
                Remaining Budget
              </h4>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  calculateRemainingBudget() >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {calculateRemainingBudget() >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
            <div
              className={`text-2xl font-bold ${
                calculateRemainingBudget() >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(calculateRemainingBudget())}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {calculateRemainingBudget() >= 0
                ? "Available to spend"
                : "Over budget"}
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <FaChartPie className="text-primary mr-2" />
              Expense Breakdown by Category
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {calculateExpensesByCategory().map((category, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="h-3 w-3 rounded-full mr-1"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-64 flex items-center justify-center">
              {/* This would be a real chart in a production app */}
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-40 h-40 rounded-full overflow-hidden relative">
                  {calculateExpensesByCategory().map((category, index) => {
                    const total = calculateTotalExpenses();
                    const percentage = (category.value / total) * 100;
                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          backgroundColor: category.color,
                          width: '100%',
                          height: '100%',
                          clipPath: `polygon(50% 50%, 50% 0, ${50 + percentage}% 0, 100% ${percentage}%, 100% 100%, 0 100%, 0 0)`
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <FaChartBar className="text-primary mr-2" />
              Budget Utilization
            </h4>
            <div className="space-y-4">
              {committees.map((committee) => {
                const allocation = budgetAllocations.find(
                  (a) => a.committee === committee.id
                );
                if (!allocation) return null;

                const utilizationPercentage = (allocation.spent / allocation.allocated) * 100;
                return (
                  <div key={committee.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {committee.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(allocation.spent)} /{" "}
                        {formatCurrency(allocation.allocated)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          utilizationPercentage > 90
                            ? "bg-red-500"
                            : utilizationPercentage > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${utilizationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Budget Allocation View */}
      {budgetView === "allocation" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <FaHandHoldingUsd className="text-primary mr-2" />
              Committee Budget Allocation
            </h4>
            <div className="space-y-4">
              {budgetAllocations.map((allocation) => {
                const committee = committees.find(
                  (c) => c.id === allocation.committee
                );
                return (
                  <div
                    key={allocation.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-800">
                        {committee?.name || "Unknown"}
                      </h5>
                      <span className="text-lg font-bold text-gray-700">
                        {formatCurrency(allocation.allocated)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Spent: {formatCurrency(allocation.spent)}</span>
                      <span>
                        Remaining:{" "}
                        {formatCurrency(allocation.allocated - allocation.spent)}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(allocation.spent / allocation.allocated) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <FaExchangeAlt className="text-primary mr-2" />
              Budget Reallocation
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Committee
                  </label>
                  <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="">Select Committee</option>
                    {committees.map((committee) => (
                      <option key={committee.id} value={committee.id}>
                        {committee.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Committee
                  </label>
                  <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="">Select Committee</option>
                    {committees.map((committee) => (
                      <option key={committee.id} value={committee.id}>
                        {committee.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Reallocate
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Reallocation
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  rows="3"
                  placeholder="Explain the reason for this reallocation"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                  Submit Reallocation
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <FaCalculator className="text-green-500 mr-2" />
              Budget Utilization Forecast
            </h4>

            <div className="space-y-4">
              {budgetAllocations.map((allocation) => {
                const committee = committees.find(
                  (c) => c.id === allocation.committee
                );
                const utilizationPercentage =
                  (allocation.spent / allocation.allocated) * 100;
                const forecastUtilization = Math.min(
                  utilizationPercentage * 1.5,
                  100
                ); // Simple forecast

                return (
                  <div
                    key={allocation.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-800">
                        {committee?.name || "Unknown"}
                      </h5>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          forecastUtilization > 90
                            ? "bg-red-100 text-red-800"
                            : forecastUtilization > 70
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {forecastUtilization > 90
                          ? "At Risk"
                          : forecastUtilization > 70
                          ? "On Track"
                          : "Under Budget"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Current:</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${utilizationPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700">
                        {utilizationPercentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm mt-1">
                      <span className="text-gray-600">Forecast:</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            forecastUtilization > 90
                              ? "bg-red-500"
                              : forecastUtilization > 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${forecastUtilization}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700">
                        {forecastUtilization.toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {forecastUtilization > 90
                        ? "Projected to exceed budget. Consider reallocation."
                        : forecastUtilization > 70
                        ? "On track to utilize allocated budget."
                        : "Projected to under-utilize. Consider reallocating excess."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManagement;
