'use server'

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

interface Transaction {
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

interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: { 
    code?: string; 
    message: string; 
    details?: unknown 
  };
}

interface Category {
  id: number;
  names: string;
  type: string;
  color: string;
}

// Extended transaction interface with added fields for display
export interface TransactionWithUser extends Omit<Transaction, 'amount'> {
  id: string;
  amount: number;
  formattedAmount: string;
  addedBy: string;
  categoryColor?: string;
}

// Interface for pagination
export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Get all categories
 */
export async function getCategoriesAction(): Promise<ActionResponse<Category[]>> {
  try {
    const result = await sql`
      SELECT id, names, type, color FROM categories
      ORDER BY names
    `;
    
    return {
      success: true,
      data: result.rows as Category[]
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: {
        message: 'Failed to fetch categories',
        details: error
      }
    };
  }
}

/**
 * Add a new transaction to the database
 */
export async function createTransactionAction(
  transaction: Transaction
): Promise<ActionResponse<Transaction>> {
  try {
    const { name, amount, category, date, type, currency, description } = transaction;
    
    // Format date to ISO string for PostgreSQL
    const formattedDate = date.toISOString().split('T')[0];
    
    // Determine which table to insert into based on the transaction type
    const tableName = type === 'income' ? 'incomes' : 'expenses';
    
    // Set column values based on currency
    let arsValue = 0;
    let usdValue = 0;
    
    if (currency === 'ARS') {
      arsValue = amount;
      // Assuming a conversion rate, this should be dynamic in a real application
      usdValue = amount / 1000; // Simplified conversion
    } else {
      usdValue = amount;
      // Assuming a conversion rate, this should be dynamic in a real application
      arsValue = amount * 1000; // Simplified conversion
    }
    
    // Find or create the category
    let categoryId = transaction.category_id;
    
    if (!categoryId) {
      // Look up the category ID by name
      const categoryResult = await sql`
        SELECT id FROM categories 
        WHERE names = ${category}
        LIMIT 1
      `;
      
      if (categoryResult.rows.length > 0) {
        categoryId = categoryResult.rows[0].id;
      } else {
        // Create a new category if it doesn't exist
        const newCategoryResult = await sql`
          INSERT INTO categories (names, type)
          VALUES (${category}, ${type === 'income' ? 'income' : 'expense'})
          RETURNING id
        `;
        categoryId = newCategoryResult.rows[0].id;
      }
    }
    
    // Use string interpolation for table name since sql.identifier is not available
    const insertFields = ['name', 'category', 'date', 'ars', 'usd', 'category_id'];
    const insertValues = [name, category, formattedDate, arsValue, usdValue, categoryId];
    
    // Check if the table has a description column
    const checkDescriptionQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}' AND column_name = 'description'
    `;
    
    const descriptionCheck = await sql.query(checkDescriptionQuery);
    const hasDescriptionColumn = descriptionCheck.rows.length > 0;
    
    // Add description to the query if the column exists
    if (hasDescriptionColumn && description) {
      insertFields.push('description');
      insertValues.push(description);
    }
    
    // Create the dynamic INSERT query
    const fieldsString = insertFields.join(', ');
    const placeholders = insertValues.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${tableName} (${fieldsString})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await sql.query(query, insertValues);
    
    const newTransaction = result.rows[0];
    
    // Revalidate all pages that might display this data
    revalidatePath('/');
    revalidatePath('/outcomes');
    revalidatePath('/incomes');
    revalidatePath('/transactions');
    
    return {
      success: true,
      data: {
        ...transaction,
        id: newTransaction.id || String(Date.now()),
        category_id: categoryId
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: { 
        message: 'Failed to create transaction.',
        details: error
      } 
    };
  }
}

/**
 * Retrieves transactions with filtering, sorting, and pagination
 * 
 * @param startDate - Optional start date filter for transactions
 * @param endDate - Optional end date filter for transactions
 * @param category - Optional category filter
 * @param searchTerm - Optional search term to filter by name or description
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @returns Promise with transactions and pagination data
 */
export async function getAllTransactionsAction(
    startDate?: Date | null,
    endDate?: Date | null,
    category?: string | null,
    searchTerm?: string | null,
    page: number = 1,
    limit: number = 10
  ): Promise<ActionResponse<{
    transactions: TransactionWithUser[],
    pagination: PaginationData
  }>> {
    try {
      // Format dates once
      const formattedStartDate = startDate?.toISOString().split('T')[0] || null;
      const formattedEndDate = endDate?.toISOString().split('T')[0] || null;
      
      // Get database schema information in parallel
      const [categoriesExist, hasDescription] = await Promise.all([
        checkTableExists('categories'),
        checkColumnExists('incomes', 'description')
      ]);
      
      // Build query conditions
      const { conditions, params } = buildQueryConditions(
        formattedStartDate || null, 
        formattedEndDate || null, 
        category || null, 
        searchTerm || null,
        hasDescription
      );
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      
      // Get total counts for pagination
      const [totalIncomes, totalExpenses] = await Promise.all([
        getCount('incomes', whereClause, params),
        getCount('expenses', whereClause, params)
      ]);
      
      const totalItems = totalIncomes + totalExpenses;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      // Return early if no results
      if (totalItems === 0) {
        return createSuccessResponse([], { totalItems, totalPages, currentPage: page, itemsPerPage: limit });
      }
      
      // Define fields to select
      const fields = getSelectFields(hasDescription);
      
      // Fetch both transaction types in parallel
      const [incomeRows, expenseRows] = await Promise.all([
        fetchTransactions('incomes', fields, whereClause, params),
        fetchTransactions('expenses', fields, whereClause, params)
      ]);
      
      // Format and combine transactions
      const incomeTransactions = formatTransactions(incomeRows, 'income', '+$');
      const expenseTransactions = formatTransactions(expenseRows, 'expense', '-$', true);
      
      // Combine, sort and paginate
      const allTransactions = [...incomeTransactions, ...expenseTransactions]
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      const paginatedTransactions = allTransactions.slice((page - 1) * limit, page * limit);
      
      // Add category colors if available
      if (categoriesExist) {
        await addCategoryColors(paginatedTransactions, incomeRows, expenseRows);
      }
      
      return createSuccessResponse(
        paginatedTransactions, 
        { totalItems, totalPages, currentPage: page, itemsPerPage: limit }
      );
    } catch (error) {
      console.error('Database Error:', error);
      return { 
        success: false, 
        error: { message: 'Failed to fetch transactions.', details: error } 
      };
    }
  }
  
  // Helper functions
  
  /**
   * Checks if a table exists in the database
   * 
   * @param tableName - Name of the table to check
   * @returns Promise resolving to boolean indicating if table exists
   */
  async function checkTableExists(tableName: string): Promise<boolean> {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      ) as exists;
    `;
    const result = await sql.query(query, [tableName]);
    return result.rows[0].exists;
  }
  
  /**
   * Checks if a column exists in a specific table
   * 
   * @param tableName - Name of the table to check
   * @param columnName - Name of the column to check
   * @returns Promise resolving to boolean indicating if column exists
   */
  async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
    const query = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 AND column_name = $2
    `;
    const result = await sql.query(query, [tableName, columnName]);
    return result.rows.length > 0;
  }
  
  /**
   * Builds SQL query conditions and parameters based on provided filters
   * 
   * @param startDate - Start date for filtering transactions
   * @param endDate - End date for filtering transactions
   * @param category - Category to filter by
   * @param searchTerm - Term to search in name and description fields
   * @param hasDescription - Whether the description column exists
   * @returns Object containing conditions array and parameters array
   */
  function buildQueryConditions(
    startDate: string | null, 
    endDate: string | null, 
    category: string | null, 
    searchTerm: string | null,
    hasDescription: boolean
  ): { conditions: string[], params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (startDate && endDate) {
      conditions.push(`date >= $${paramIndex++} AND date <= $${paramIndex++}`);
      params.push(startDate, endDate);
    }
    
    if (category && category !== 'All categories') {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }
    
    if (searchTerm) {
      if (hasDescription) {
        conditions.push(`(name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      } else {
        conditions.push(`name ILIKE $${paramIndex++}`);
        params.push(`%${searchTerm}%`);
      }
    }
    
    return { conditions, params };
  }
  
  /**
   * Gets the count of records in a table that match the given conditions
   * 
   * @param table - Name of the table to query
   * @param whereClause - SQL WHERE clause (including the "WHERE" keyword)
   * @param params - Parameters for the prepared statement
   * @returns Promise resolving to the count as a number
   */
  async function getCount(
    table: string, 
    whereClause: string, 
    params: any[]
  ): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const result = await sql.query(query, params);
    return parseInt(result.rows[0].total || '0');
  }
  
  /**
   * Generates the SELECT fields string based on whether description column exists
   * 
   * @param hasDescription - Whether the description column exists
   * @returns SQL fields string for SELECT statement
   */
  function getSelectFields(hasDescription: boolean): string {
    let fields = 'name, category, date, ars, usd, category_id';
    return hasDescription ? fields + ', description' : fields + ', \'\' as description';
  }
  
  /**
   * Fetches transactions from the specified table with given conditions
   * 
   * @param table - Table name to query (incomes or expenses)
   * @param fields - Fields to include in SELECT statement
   * @param whereClause - SQL WHERE clause (including the "WHERE" keyword)
   * @param params - Parameters for the prepared statement
   * @returns Promise resolving to array of transaction rows
   */
  async function fetchTransactions(
    table: string, 
    fields: string, 
    whereClause: string, 
    params: any[]
  ): Promise<any[]> {
    const query = `SELECT ${fields} FROM ${table} ${whereClause}`;
    const result = await sql.query(query, params);
    return result.rows;
  }
  
  /**
   * Formats raw database rows into TransactionWithUser objects
   * 
   * @param rows - Raw database rows to format
   * @param type - Transaction type (income or expense)
   * @param amountPrefix - Prefix for formatted amount string ("+$" or "-$")
   * @param negateAmount - Whether to negate the amount value (true for expenses)
   * @returns Array of formatted TransactionWithUser objects
   */
  function formatTransactions(
    rows: any[], 
    type: 'income' | 'expense', 
    amountPrefix: string,
    negateAmount: boolean = false
  ): TransactionWithUser[] {
    return rows.map((row, index) => {
      const amount = negateAmount ? -Number(row.usd) : Number(row.usd);
      return {
        id: `${type}_${index}`,
        name: row.name,
        category: row.category,
        date: new Date(row.date),
        description: row.description || '',
        amount: amount,
        type: type,
        currency: 'USD',
        formattedAmount: `${amountPrefix}${Math.abs(Number(row.usd)).toFixed(2)}`,
        addedBy: type === 'income' ? 'Jane Doe' : 'John Doe',
        categoryColor: undefined
      } as TransactionWithUser;
    });
  }
  
  /**
   * Adds category colors to transactions by looking up category_id in the categories table
   * 
   * @param transactions - Array of transactions to enhance with colors
   * @param incomeRows - Raw income rows from database (source of category_id)
   * @param expenseRows - Raw expense rows from database (source of category_id)
   * @returns Promise that resolves when colors are added (void)
   */
  async function addCategoryColors(
    transactions: TransactionWithUser[], 
    incomeRows: any[], 
    expenseRows: any[]
  ): Promise<void> {
    // Create a map of transactions with their category IDs
    const transactionsWithCategoryIds = transactions.map(t => {
      return {
        transaction: t,
        categoryId: (
          incomeRows.find(r => r.name === t.name)?.category_id || 
          expenseRows.find(r => r.name === t.name)?.category_id
        )
      };
    }).filter(item => item.categoryId != null);
    
    const categoryIds = transactionsWithCategoryIds.map(t => t.categoryId);
    
    if (categoryIds.length === 0) return;
    
    // Get unique category IDs
    const uniqueCategoryIds = Array.from(new Set(categoryIds));
    const placeholders = uniqueCategoryIds.map((_, i) => `$${i + 1}`).join(',');
    
    const query = `SELECT id, color FROM categories WHERE id IN (${placeholders})`;
    const result = await sql.query(query, uniqueCategoryIds);
    
    // Create a map of category ID to color
    const categoryColors: Record<number, string> = {};
    result.rows.forEach(row => {
      categoryColors[row.id] = row.color;
    });
    
    // Apply colors to transactions
    transactionsWithCategoryIds.forEach(item => {
      if (item.categoryId && categoryColors[item.categoryId]) {
        item.transaction.categoryColor = categoryColors[item.categoryId];
      }
    });
  }
  
  /**
   * Creates a standardized success response object
   * 
   * @param transactions - Array of transactions to include in response
   * @param pagination - Pagination data for the response
   * @returns Formatted success response object
   */
  function createSuccessResponse(
    transactions: TransactionWithUser[], 
    pagination: PaginationData
  ): ActionResponse<{ transactions: TransactionWithUser[], pagination: PaginationData }> {
    return {
      success: true,
      data: { transactions, pagination }
    };
  }

/**
 * Get transaction categories
 */
export async function getTransactionCategoriesAction(): Promise<ActionResponse<string[]>> {
  try {
    // Check if categories table exists
    const checkCategoriesQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      ) as exists;
    `;
    
    const categoriesResult = await sql.query(checkCategoriesQuery);
    const categoriesExist = categoriesResult.rows[0].exists;
    
    if (categoriesExist) {
      // Get categories from the dedicated table
      const result = await sql`
        SELECT names FROM categories
        ORDER BY names
      `;
      
      const categories = result.rows.map(row => row.names);
      
      return {
        success: true,
        data: categories
      };
    } else {
      // Fall back to the old method
      // Get unique categories from both incomes and expenses tables
      const expenseCategoriesResult = await sql`
        SELECT DISTINCT category FROM expenses
      `;
      
      const incomeCategoriesResult = await sql`
        SELECT DISTINCT category FROM incomes
      `;
      
      // Combine categories
      const expenseCategories = expenseCategoriesResult.rows.map(row => row.category);
      const incomeCategories = incomeCategoriesResult.rows.map(row => row.category);
      const allCategories = [...expenseCategories, ...incomeCategories];
      
      // Use Array.from for Set to avoid linter issues
      const categorySet = new Set(allCategories);
      const uniqueCategories = Array.from(categorySet).filter(Boolean) as string[];
      
      // Add default categories if none exist
      if (uniqueCategories.length === 0) {
        return {
          success: true,
          data: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Other', 'Salary', 'Investment']
        };
      }
      
      return {
        success: true,
        data: uniqueCategories
      };
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: { 
        message: 'Failed to fetch categories.',
        details: error
      } 
    };
  }
}

/**
 * Get dashboard summary data
 */
export async function getDashboardSummaryAction(): Promise<ActionResponse<{
  currentBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  incomeChangePercent: number;
  expensesChangePercent: number;
}>> {
  try {
    // Get current month data
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Get previous month data
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    
    // Query for current month incomes and expenses
    const currentIncomeResult = await sql`
      SELECT SUM(ars) as total_ars FROM incomes
      WHERE date >= ${currentMonthStart} AND date <= ${currentMonthEnd}
    `;
    
    const currentExpenseResult = await sql`
      SELECT SUM(ars) as total_ars FROM expenses
      WHERE date >= ${currentMonthStart} AND date <= ${currentMonthEnd}
    `;
    
    // Query for previous month incomes and expenses
    const prevIncomeResult = await sql`
      SELECT SUM(ars) as total_ars FROM incomes
      WHERE date >= ${prevMonthStart} AND date <= ${prevMonthEnd}
    `;
    
    const prevExpenseResult = await sql`
      SELECT SUM(ars) as total_ars FROM expenses
      WHERE date >= ${prevMonthStart} AND date <= ${prevMonthEnd}
    `;
    
    // Calculate total incomes and expenses (all time)
    const totalIncomeResult = await sql`
      SELECT SUM(ars) as total_ars FROM incomes
    `;
    
    const totalExpenseResult = await sql`
      SELECT SUM(ars) as total_ars FROM expenses
    `;
    
    // Extract values
    const currentIncome = Number(currentIncomeResult.rows[0]?.total_ars || 0);
    const currentExpense = Number(currentExpenseResult.rows[0]?.total_ars || 0);
    const prevIncome = Number(prevIncomeResult.rows[0]?.total_ars || 0);
    const prevExpense = Number(prevExpenseResult.rows[0]?.total_ars || 0);
    const totalIncome = Number(totalIncomeResult.rows[0]?.total_ars || 0);
    const totalExpense = Number(totalExpenseResult.rows[0]?.total_ars || 0);
    
    // Calculate current balance and percentage changes
    const currentBalance = totalIncome - totalExpense;
    
    // Calculate percentage changes
    const incomeChangePercent = prevIncome === 0 
      ? 100 
      : Math.round(((currentIncome - prevIncome) / prevIncome) * 100);
    
    const expensesChangePercent = prevExpense === 0 
      ? 0 
      : Math.round(((currentExpense - prevExpense) / prevExpense) * 100);
    
    return {
      success: true,
      data: {
        currentBalance,
        incomeThisMonth: currentIncome,
        expensesThisMonth: currentExpense,
        incomeChangePercent,
        expensesChangePercent
      }
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: { 
        message: 'Failed to fetch dashboard summary.',
        details: error
      } 
    };
  }
}

/**
 * Get spending by category data
 */
export async function getSpendingByCategoryAction(
  startDate: Date | null, 
  endDate: Date | null
): Promise<ActionResponse<Array<{
  category: string;
  amount: number;
  color?: string;
}>>> {
  try {
    const start = startDate ? startDate.toISOString().split('T')[0] : undefined;
    const end = endDate ? endDate.toISOString().split('T')[0] : undefined;
    
    // Check if categories table exists
    const checkCategoriesQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      ) as exists;
    `;
    
    const categoriesResult = await sql.query(checkCategoriesQuery);
    const categoriesExist = categoriesResult.rows[0].exists;
    
    let query;
    if (categoriesExist) {
      // Use categories table for enhanced data
      query = `
        SELECT e.category, SUM(e.ars) as total_ars, c.color
        FROM expenses e
        LEFT JOIN categories c ON e.category_id = c.id
      `;
      
      if (start && end) {
        query += ` WHERE e.date >= '${start}' AND e.date <= '${end}'`;
      }
      
      query += `
        GROUP BY e.category, c.color
        ORDER BY total_ars DESC
      `;
    } else {
      // Fall back to simple query
      query = `
        SELECT category, SUM(ars) as total_ars
        FROM expenses
      `;
      
      if (start && end) {
        query += ` WHERE date >= '${start}' AND date <= '${end}'`;
      }
      
      query += `
        GROUP BY category
        ORDER BY total_ars DESC
      `;
    }
    
    const result = await sql.query(query);
    
    // Format the result
    const categoryData = result.rows.map(row => ({
      category: row.category,
      amount: Number(row.total_ars),
      ...(row.color && { color: row.color })
    }));
    
    return {
      success: true,
      data: categoryData
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: { 
        message: 'Failed to fetch spending by category.',
        details: error
      } 
    };
  }
}

/**
 * Delete a transaction
 */
export async function deleteTransactionAction(
  id: string,
  type: 'income' | 'expense'
): Promise<ActionResponse<void>> {
  try {
    // Determine which table to delete from based on transaction type
    const tableName = type === 'income' ? 'incomes' : 'expenses';
    
    // First check if the table has a name column
    const query = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}' AND column_name = 'name'
    `;
    
    const columnsResult = await sql.query(query);
    
    if (columnsResult.rows.length > 0) {
      // Use a different approach for deletion
      // Since we don't have real IDs, we'll use a combination of attributes
      // This is a workaround and not ideal for production
      const deleteQuery = `
        DELETE FROM ${tableName} 
        WHERE name = (
          SELECT name FROM ${tableName} 
          ORDER BY date DESC 
          LIMIT 1 OFFSET ${parseInt(id) - 1}
        )
        AND date = (
          SELECT date FROM ${tableName} 
          ORDER BY date DESC 
          LIMIT 1 OFFSET ${parseInt(id) - 1}
        )
        LIMIT 1
      `;
      
      await sql.query(deleteQuery);
    } else {
      // If there's no name column, we can't safely delete
      throw new Error(`Cannot delete from ${tableName}, missing required columns`);
    }
    
    // Revalidate affected paths
    revalidatePath('/');
    revalidatePath('/outcomes');
    revalidatePath('/incomes');
    revalidatePath('/transactions');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      error: { 
        message: 'Failed to delete transaction.',
        details: error
      } 
    };
  }
} 