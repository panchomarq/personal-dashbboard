import React from 'react';
import { FinancialRecord } from '@/lib/types/definitions';

/**
 * Component for displaying financial overview statistics
 */
interface FinancialOverviewProps {
  data: FinancialRecord[];
  currentCurrency: 'ARS' | 'USD';
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ 
  data, 
  currentCurrency 
}) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No financial data available</div>;
  }

  const financialData = data[0];
  
  // Parse currency strings to numbers
  const currencyKey = currentCurrency.toLowerCase() as 'ars' | 'usd';
  const outcomeValue = parseFloat(financialData.outcome[currencyKey].replace(/[^\d.-]/g, ''));
  const incomeValue = parseFloat(financialData.income[currencyKey].replace(/[^\d.-]/g, ''));
  
  // Calculate balance and savings rate
  const balance = incomeValue - outcomeValue;
  const savingsRate = incomeValue > 0 ? (balance / incomeValue) * 100 : 0;
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-xl font-medium">{formatCurrency(incomeValue)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-xl font-medium">{formatCurrency(outcomeValue)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Balance</p>
          <p className={`text-xl font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Savings Rate</p>
          <p className={`text-xl font-medium ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-md font-medium mb-2">Income vs Expenses</h3>
          <div className="flex h-4 mb-2 overflow-hidden rounded-full">
            <div 
              className="bg-blue-500" 
              style={{ width: `${(incomeValue / (incomeValue + outcomeValue)) * 100}%` }}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${(outcomeValue / (incomeValue + outcomeValue)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Income: {Math.round((incomeValue / (incomeValue + outcomeValue)) * 100)}%</span>
            <span>Expenses: {Math.round((outcomeValue / (incomeValue + outcomeValue)) * 100)}%</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-md font-medium mb-2">Financial Health</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Savings Rate</span>
              <span className={`text-sm font-medium ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Income-Expense Ratio</span>
              <span className={`text-sm font-medium ${incomeValue / outcomeValue >= 1.5 ? 'text-green-600' : incomeValue / outcomeValue >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                {incomeValue / outcomeValue >= 1.5 ? 'Excellent' : incomeValue / outcomeValue >= 1 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview; 