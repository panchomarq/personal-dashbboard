// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestOutcome = {
  name: string;
  date: Date;
  usd: number;
  ars: number;
  category: string;
  amount: string;
}

export type LatestIncome = {
  name: string;
  date: Date;
  usd: number;
  ars: number;
  category: string;
  amount: string;
}

export interface CurrencyAmounts {
  ars: string; 
  usd: string;
}

export interface FinancialRecord {
  outcome: CurrencyAmounts;
  income: CurrencyAmounts;
}

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export interface LatestOutcomeProps {
  outcomeData: LatestOutcome[]
}
export interface LatestIncomeProps {
  incomeData: LatestIncome[]
  value: number | string;
  currency: 'ARS' | 'USD';
  currentCurrency: 'ARS' | 'USD';
}

export interface CardWrapperProps {
  cardData: FinancialRecord[];
  currentCurrency: 'ARS' | 'USD';
}

export interface CardProps {
  title: string;
  value: number | string;
  value2: number | string;
  currency: 'ARS' | 'USD';
  currency2: 'ARS' | 'USD';
  currentCurrency: 'ARS' | 'USD';
}