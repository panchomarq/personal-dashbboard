'use client';

import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { 
  getAllTransactionsAction, 
  deleteTransactionAction,
  getCategoriesAction,
  TransactionWithUser,
  PaginationData
} from '@/lib/actions/transactionsActions';
import { PlusIcon, DownloadIcon, SearchIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import AddTransactionModal, { Transaction, ActionResponse } from '@/components/dashboard/AddTransactionModal';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { subDays } from 'date-fns';

export default function TransactionsPage() {
  // Default date range (last 30 days)
  const defaultDateRange: DateRange = {
    from: subDays(new Date(), 30),
    to: new Date()
  };

  // State for date range filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);
  
  // State for search and category filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All categories');
  
  // State for transactions data
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for pagination
  const [pagination, setPagination] = useState<PaginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  });
  
  // State for transaction modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Router for navigation
  const router = useRouter();
  
  // Default category color map (fallback if no colors in DB)
  const defaultCategoryColorMap: Record<string, string> = {
    'Food': 'bg-green-100 text-green-800',
    'Housing': 'bg-blue-100 text-blue-800',
    'Transportation': 'bg-yellow-100 text-yellow-800',
    'Entertainment': 'bg-red-100 text-red-800',
    'Income': 'bg-green-100 text-green-800',
    'Salary': 'bg-green-100 text-green-800',
    'Investment': 'bg-purple-100 text-purple-800',
    'Other': 'bg-gray-100 text-gray-800',
  };
  
  // Function to load transactions
  const loadTransactions = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Convert Date objects to strings for server action
      const fromDate = dateRange?.from ? new Date(dateRange.from) : null;
      const toDate = dateRange?.to ? new Date(dateRange.to) : null;
      
      const response = await getAllTransactionsAction(
        fromDate,
        toDate,
        selectedCategory === 'All categories' ? null : selectedCategory,
        searchTerm || null,
        page,
        10
      );
      
      if (response.success && response.data) {
        // Convert string dates back to Date objects
        const formattedTransactions = response.data.transactions.map(t => ({
          ...t,
          date: new Date(t.date)
        }));
        
        setTransactions(formattedTransactions);
        setPagination(response.data.pagination);
      } else {
        console.error('Failed to load transactions:', response.error);
        // Set empty transactions when there's an error
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Set empty transactions when there's an error
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to load categories
  const loadCategories = async () => {
    try {
      const response = await getCategoriesAction();
      if (response.success && response.data) {
        const categoryNames = response.data.map(category => category.names);
        setCategories(['All categories', ...categoryNames]);
      } else {
        console.error('Failed to load categories:', response.error);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };
  
  // Handle date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      // Ensure we create fresh Date objects to avoid issues
      const newRange = {
        from: range.from ? new Date(range.from) : undefined,
        to: range.to ? new Date(range.to) : undefined
      };
      setDateRange(newRange);
    } else {
      setDateRange(range);
    }
  };
  
  // Load initial data
  useEffect(() => {
    loadCategories();
    loadTransactions(1);
  }, []);
  
  // Load transactions when filters change
  useEffect(() => {
    loadTransactions(1); // Reset to first page when filters change
  }, [dateRange, selectedCategory, searchTerm]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      loadTransactions(newPage);
    }
  };
  
  // Handle transaction delete
  const handleDeleteTransaction = async (id: string, type: 'income' | 'expense') => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await deleteTransactionAction(id, type);
        if (response.success) {
          // Reload the current page
          loadTransactions(pagination.currentPage);
        } else {
          console.error('Failed to delete transaction:', response.error);
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };
  
  // Handle transaction save
  const handleSaveTransaction = async (transaction: Transaction): Promise<ActionResponse<Transaction>> => {
    try {
      // Import this action only when needed to avoid cyclic dependencies
      const { createTransactionAction } = await import('@/lib/actions/transactionsActions');
      
      // Ensure we're using a fresh Date object
      const newTransaction = {
        ...transaction,
        date: new Date(transaction.date)
      };
      
      const response = await createTransactionAction(newTransaction);
      if (response.success) {
        // Reload transactions after successful save
        await loadTransactions(1);
        setIsModalOpen(false);
      }
      return response;
    } catch (error) {
      console.error('Error saving transaction:', error);
      return {
        success: false,
        error: {
          message: 'Failed to save transaction',
          details: error
        }
      };
    }
  };
  
  // Get category color style
  const getCategoryColorStyle = (transaction: TransactionWithUser): string => {
    // First check if the transaction has a categoryColor from the database
    if (transaction.categoryColor) {
      // If it's already a class name, use it directly
      if (!transaction.categoryColor.startsWith('#')) {
        return transaction.categoryColor;
      }
      // We won't handle hex colors with inline styles here to avoid typing issues
    }
    
    // Fallback to the default color map
    return defaultCategoryColorMap[transaction.category] || 'bg-gray-100 text-gray-800';
  };
  
  // Get inline style for category with hex color
  const getCategoryInlineStyle = (transaction: TransactionWithUser) => {
    if (transaction.categoryColor?.startsWith('#')) {
      return {
        backgroundColor: `${transaction.categoryColor}25`, // 25 is hex for 15% opacity
        color: transaction.categoryColor
      };
    }
    return undefined;
  };
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Transactions</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon size={16} />
            <span>Add Transaction</span>
          </button>
          
          <button className="btn-secondary flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
            <DownloadIcon size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex">
          <button className="px-4 py-2 text-navy-900 font-medium border-b-2 border-navy-900">
            All Transactions
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <DateRangePicker
            defaultValue={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="search-filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added By
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading state
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              // Transactions list
              transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.name}
                    {transaction.description && (
                      <p className="text-xs text-gray-500 mt-1">{transaction.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColorStyle(transaction)}`}
                      style={getCategoryInlineStyle(transaction)}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.addedBy}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.formattedAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => {
                          // Edit functionality (to be implemented)
                          console.log('Edit transaction:', transaction.id);
                        }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteTransaction(transaction.id, transaction.type)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // No results
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!isLoading && transactions.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span>{' '}
                of <span className="font-medium">{pagination.totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === pagination.currentPage
                        ? 'z-10 bg-navy-900 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories.filter(c => c !== 'All categories')}
      />
    </main>
  );
} 