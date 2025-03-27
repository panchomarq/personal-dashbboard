import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Interface for category spending data
 */
interface CategorySpending {
  category: string;
  amount: number;
  color: string;
  percentage?: number;
}

/**
 * SpendingByCategory component to display expenditure by category
 */
interface SpendingByCategoryProps {
  data: CategorySpending[];
  isLoading?: boolean;
}

const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Clean up the previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || isLoading || data.length === 0) return;

    // Calculate percentages if not provided
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const dataWithPercentages = data.map(item => ({
      ...item,
      percentage: item.percentage || Math.round((item.amount / totalAmount) * 100)
    }));

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: dataWithPercentages.map(item => item.category),
        datasets: [
          {
            data: dataWithPercentages.map(item => item.amount),
            backgroundColor: ['#205781', '#3477A1', '#4E88AD', '#6799B9', '#81AAC5', '#9ABBD0', '#B3CCDC', '#CDDDE8'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11,
                family: 'Lato'
              },
              color: '#3E3F5B'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.formattedValue;
                const percentage = dataWithPercentages[context.dataIndex].percentage;
                return `${label}: ${value} (${percentage}%)`;
              }
            },
            backgroundColor: '#205781',
            titleFont: {
              family: 'Lato',
              size: 12
            },
            bodyFont: {
              family: 'Lato',
              size: 12
            },
            borderColor: '#205781',
            borderWidth: 1
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-80 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-slate/60">
          No spending data available for this period
        </div>
      ) : (
        <>
          <div className="h-80 relative">
            <canvas ref={chartRef} />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {data.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: ['#205781', '#3477A1', '#4E88AD', '#6799B9', '#81AAC5', '#9ABBD0', '#B3CCDC', '#CDDDE8'][index % 8] }}
                ></div>
                <span className="text-slate">{item.category} ({item.percentage || Math.round((item.amount / data.reduce((sum, item) => sum + item.amount, 0)) * 100)}%)</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default SpendingByCategory; 