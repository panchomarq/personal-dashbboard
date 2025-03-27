'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { 
  CardsSkeleton 
} from '@/components/ui/Skeletons';
import { 
  getDashboardSummaryAction, 
  getSpendingByCategoryAction,
  getTransactionCategoriesAction,
  createTransactionAction
} from '@/lib/actions/transactionsActions';
import { 
  PlusIcon, 
  DownloadIcon,
  CalendarIcon
} from 'lucide-react';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { startOfMonth, endOfMonth, subDays, format } from 'date-fns';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendingByCategory from '@/components/dashboard/SpendingByCategory';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import AddTransactionModal, { Transaction, ActionResponse } from '@/components/dashboard/AddTransactionModal';
import { Button } from '@/components/ui/Button';

export default function Page() {
  // Define initial date range (last 30 days)
  const defaultDateRange: DateRange = {
    from: subDays(new Date(), 30),
    to: new Date()
  };

  // State for date filtering
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);
  
  // State for loading indicators
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for dashboard data
  const [summaryData, setSummaryData] = useState({
    currentBalance: 0,
    incomeThisMonth: 0,
    expensesThisMonth: 0,
    incomeChangePercent: 0,
    expensesChangePercent: 0
  });
  
  // State for spending by category
  const [categoryData, setCategoryData] = useState<Array<{
    category: string;
    amount: number;
    color: string;
    percentage?: number;
  }>>([]);
  
  // State for budget data
  const [budgetData, setBudgetData] = useState<Array<{
    category: string;
    spent: number;
    budget: number;
    color?: string;
  }>>([]);
  
  // State for transaction modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Colors for the pie chart - updated to match new theme
  const categoryColors = [
    '#8AB2A6', // sage
    '#ACD3A8', // mint
    '#3E3F5B', // slate
    '#F6F1DE', // cream
    '#6B7280', // gray-500
    '#EF4444', // red-500
    '#F59E0B', // amber-500
    '#10B981', // emerald-500
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Skip fetching if date range is not complete
        if (!dateRange?.from || !dateRange?.to) {
          setIsLoading(false);
          return;
        }

        // Fetch dashboard summary data
        const summaryResponse = await getDashboardSummaryAction();
        if (summaryResponse.success && summaryResponse.data) {
          setSummaryData(summaryResponse.data);
        }
        
        // Fetch spending by category data
        const categoryResponse = await getSpendingByCategoryAction(dateRange.from, dateRange.to);
        if (categoryResponse.success && categoryResponse.data) {
          // Add colors to categories
          const coloredCategoryData = categoryResponse.data.map((item, index) => ({
            ...item,
            color: categoryColors[index % categoryColors.length]
          }));
          setCategoryData(coloredCategoryData);
          
          // Generate mock budget data based on spending
          const mockBudgetData = coloredCategoryData.map(item => ({
            category: item.category,
            spent: item.amount,
            budget: item.amount * (Math.random() * 0.5 + 1), // Random budget between 100% and 150% of spent
            color: item.color
          }));
          setBudgetData(mockBudgetData);
        }
        
        // Fetch transaction categories
        const categoriesResponse = await getTransactionCategoriesAction();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  
  const handleSaveTransaction = async (transaction: Transaction): Promise<ActionResponse<Transaction>> => {
    try {
      const response = await createTransactionAction(transaction);
      if (response.success) {
        // Refresh data after adding a transaction
        const summaryResponse = await getDashboardSummaryAction();
        if (summaryResponse.success && summaryResponse.data) {
          setSummaryData(summaryResponse.data);
        }
        
        // Only fetch category data if date range is complete
        if (dateRange?.from && dateRange?.to) {
          const categoryResponse = await getSpendingByCategoryAction(dateRange.from, dateRange.to);
          if (categoryResponse.success && categoryResponse.data) {
            const coloredCategoryData = categoryResponse.data.map((item, index) => ({
              ...item,
              color: categoryColors[index % categoryColors.length]
            }));
            setCategoryData(coloredCategoryData);
          }
        }
      }
      return response;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  };
  
  return (
    <main className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate">Dashboard</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <PlusIcon size={16} />
            <span>Add Transaction</span>
          </button>
          
          <button className="btn-secondary">
            <DownloadIcon size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Date filter using the DateRangePicker component */}
      <div className="mb-8 max-w-sm">
        <DateRangePicker 
          defaultValue={defaultDateRange}
          onChange={handleDateRangeChange}
          showTwoMonths={true}
          showPresetButtons={false}
        />
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="dashboard-card">
          <div className="mb-2 text-sm text-slate">Current Balance</div>
          <div className="text-2xl font-bold text-navy-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(summaryData.currentBalance)}
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="mb-2 text-sm text-slate">Income This Month</div>
          <div className="text-2xl font-bold text-navy-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(summaryData.incomeThisMonth)}
          </div>
          {summaryData.incomeChangePercent > 0 && (
            <div className="text-sm text-green-500">
              +{summaryData.incomeChangePercent}% from last month
            </div>
          )}
        </div>
        
        <div className="dashboard-card">
          <div className="mb-2 text-sm text-slate">Expenses This Month</div>
          <div className="text-2xl font-bold text-navy-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(summaryData.expensesThisMonth)}
          </div>
          {summaryData.expensesChangePercent !== 0 && (
            <div className="text-sm text-red-500">
              {summaryData.expensesChangePercent > 0 ? '+' : ''}{summaryData.expensesChangePercent}% than last month
            </div>
          )}
        </div>
      </div>
      
      {/* Charts and visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4 text-navy-900">Spending by Category</h2>
          {isLoading ? (
            <div className="h-80 bg-gray-100 animate-pulse rounded-md"></div>
          ) : (
            <SpendingByCategory 
              data={categoryData}
              isLoading={isLoading}
            />
          )}
        </div>
        
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4 text-navy-900">Budget Progress</h2>
          {isLoading ? (
            <div className="h-80 bg-gray-100 animate-pulse rounded-md"></div>
          ) : (
            <BudgetProgress 
              data={budgetData}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
      
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
      />
    </main>
  );
}