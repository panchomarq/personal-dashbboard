import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

/**
 * SummaryCard component for displaying a summary card with title, value, and change indicator
 */
interface SummaryCardProps {
  title: string;
  value: string;
  changePercent?: number;
  changeText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  currency?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  changePercent,
  changeText,
  icon,
  isLoading = false,
  currency = '$',
}) => {
  return (
    <div className="bg-white p-5 rounded-md border border-sage shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center text-slate text-sm">
          {icon && <span className="mr-2">{icon}</span>}
          <span>{title}</span>
        </div>
      </div>

      <div className="mb-2">
        {isLoading ? (
          <div className="h-8 bg-cream animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl font-semibold text-slate">{value}</div>
        )}
      </div>

      {changePercent !== undefined && (
        <div className="flex items-center text-sm">
          {changePercent > 0 ? (
            <span className="flex items-center text-mint">
              <ArrowUpIcon size={14} className="mr-1" /> {Math.abs(changePercent)}% {changeText}
            </span>
          ) : changePercent < 0 ? (
            <span className="flex items-center text-red-500">
              <ArrowDownIcon size={14} className="mr-1" /> {Math.abs(changePercent)}% {changeText}
            </span>
          ) : (
            <span className="text-slate/60">No change {changeText}</span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * SummaryCards component for displaying a collection of summary cards
 */
interface SummaryCardsProps {
  currentBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  incomeChangePercent?: number;
  expensesChangePercent?: number;
  isLoading?: boolean;
  currency?: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  currentBalance,
  incomeThisMonth,
  expensesThisMonth,
  incomeChangePercent = 0,
  expensesChangePercent = 0,
  isLoading = false,
  currency = '$',
}) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('$', '');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <SummaryCard
        title="Current Balance"
        value={`${currency}${formatCurrency(currentBalance)}`}
        icon={<div className="w-6 h-6 flex items-center justify-center bg-cream text-slate rounded-md">💰</div>}
        isLoading={isLoading}
      />
      
      <SummaryCard
        title="Income This Month"
        value={`${currency}${formatCurrency(incomeThisMonth)}`}
        changePercent={incomeChangePercent}
        changeText="from last month"
        icon={<div className="w-6 h-6 flex items-center justify-center bg-cream text-sage rounded-md">💹</div>}
        isLoading={isLoading}
      />
      
      <SummaryCard
        title="Expenses This Month"
        value={`${currency}${formatCurrency(expensesThisMonth)}`}
        changePercent={-expensesChangePercent}
        changeText="than last month"
        icon={<div className="w-6 h-6 flex items-center justify-center bg-cream text-slate rounded-md">📉</div>}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SummaryCards; 