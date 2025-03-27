import React from 'react';

/**
 * Interface for budget category data
 */
interface BudgetCategory {
  category: string;
  spent: number;
  budget: number;
  color?: string;
}

/**
 * Interface for BudgetProgress component
 */
interface BudgetProgressProps {
  data: BudgetCategory[];
  isLoading?: boolean;
}

/**
 * Single progress bar for a budget category
 */
const BudgetProgressBar: React.FC<{
  category: string;
  spent: number;
  budget: number;
  color?: string;
}> = ({ category, spent, budget, color = '#205781' }) => {
  const percentage = Math.min(100, Math.round((spent / budget) * 100));
  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(spent);
  
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(budget);

  // Determine color based on percentage
  let progressColor = color;
  if (percentage > 90) {
    progressColor = '#ef4444'; // red for over 90%
  } else if (percentage > 75) {
    progressColor = '#3477A1'; // medium blue for 75-90%
  } else {
    progressColor = '#6799B9'; // light blue for under 75%
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate">{category}</span>
        <span className="text-sm text-slate/70">{formattedSpent} / {formattedBudget}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-500" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: progressColor
          }}
        ></div>
      </div>
    </div>
  );
};

/**
 * BudgetProgress component to display budget progress for different categories
 */
const BudgetProgress: React.FC<BudgetProgressProps> = ({ 
  data, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex justify-between mb-1">
              <div className="h-4 bg-gray-100 rounded w-24"></div>
              <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate total budget and total spent
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  
  return (
    <>
      {data.length === 0 ? (
        <div className="text-slate/60 text-center py-8">
          No budget data available
        </div>
      ) : (
        <div>
          {data.map((item, index) => (
            <BudgetProgressBar
              key={index}
              category={item.category}
              spent={item.spent}
              budget={item.budget}
              color={item.color || '#205781'}
            />
          ))}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <BudgetProgressBar
              category="Total Budget"
              spent={totalSpent}
              budget={totalBudget}
              color="#205781" // navy
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetProgress; 