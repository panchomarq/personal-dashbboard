import React, { useState } from 'react';

/**
 * Interface for a transaction
 */
export interface Transaction {
  id?: string;
  name: string;
  amount: number;
  category: string;
  category_id?: number;
  date: Date;
  type: 'income' | 'expense';
  currency: 'ARS' | 'USD';
  description?: string;
}

/**
 * Response from transaction operations
 */
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: { 
    code?: string; 
    message: string; 
    details?: unknown 
  };
}

/**
 * Interface for AddTransactionModal
 */
interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => Promise<ActionResponse<Transaction>>;
  categories: string[];
}

/**
 * AddTransactionModal component for adding new transactions
 */
const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>({
    name: '',
    amount: 0,
    category: categories[0] || '',
    date: new Date(),
    type: 'expense',
    currency: 'ARS',
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setTransaction({
        ...transaction,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'date') {
      setTransaction({
        ...transaction,
        [name]: new Date(value)
      });
    } else {
      setTransaction({
        ...transaction,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!transaction.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (transaction.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (!transaction.category) {
      setError('Category is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await onSave(transaction);
      
      if (response.success) {
        onClose();
        
        // Reset form after successful submission
        setTransaction({
          name: '',
          amount: 0,
          category: categories[0] || '',
          date: new Date(),
          type: 'expense',
          currency: 'ARS',
        });
      } else if (response.error) {
        setError(response.error.message);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md border border-navy-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy-900">Add Transaction</h2>
          <button 
            onClick={onClose}
            className="text-navy-900 hover:text-navy-700 bg-transparent"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">
                Transaction Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={transaction.type === 'income'}
                    onChange={handleChange}
                    className="mr-2 accent-navy-900"
                  />
                  <span className="text-slate">Income</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={transaction.type === 'expense'}
                    onChange={handleChange}
                    className="mr-2 accent-navy-900"
                  />
                  <span className="text-slate">Expense</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={transaction.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
                placeholder="e.g., Groceries, Salary, etc."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={transaction.amount || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={transaction.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">
                Category
              </label>
              <select
                name="category"
                value={transaction.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={transaction.date.toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={transaction.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-navy-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 bg-white text-slate"
                placeholder="Add notes about this transaction..."
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal; 