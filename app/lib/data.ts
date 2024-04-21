import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestIncome,
  LatestOutcome,
  User,
  FinancialRecord,
} from './definitions';
import { formatCurrency, formatCurrencyUSD, formatCurrencyARS } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

// Traemos los últimos Outcomes
export async function fetchLatestOutcomes() {
  try {
    const data = await sql<LatestOutcome>`
      SELECT name, category, usd, date
      FROM expenses
      ORDER BY usd DESC
      LIMIT 5`;

    const latestOutcomes = data.rows.map((outcome) => ({
      ...outcome,
      amount: formatCurrency(outcome.usd),
    }));

    return latestOutcomes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest outcomes.');
  }
}

// Traemos los últimos Incomes
export async function fetchLatestIncomes() {
  try {
    const data = await sql<LatestIncome>`
      SELECT name, category, usd, date
      FROM incomes
      ORDER BY date DESC
      LIMIT 5`;

    const latestIncomes = data.rows.map((income) => ({
      ...income,
      amount: formatCurrency(income.usd),
    }));

    return latestIncomes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest incomes.');
  }
}

// Traemos datos de las tarjetas
export async function fetchCardData() {
  try {
    const outcomesPromise = sql`SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM expenses`;
    const incomesPromise = sql`SELECT SUM(ars) AS ars_tota, SUM(usd) AS usd_tota FROM incomes`;

    const data = await Promise.all([outcomesPromise, incomesPromise]);

    // Outcomes ARS / USD
    const totalOutcomesARS = Number(data[0].rows[0].ars_total ?? '0');
    const totalOutcomesCurrencyARS = formatCurrencyARS(totalOutcomesARS);

    const totalOutcomesUSD = Number(data[0].rows[0].usd_total ?? '0');
    const totalOutcomesCurrencyUSD = formatCurrencyARS(totalOutcomesUSD);

    // Incomes ARS / USD
    const totalIncomesARS = Number(data[1].rows[0].ars_tota ?? '0');
    const totalIncomesCurrencyARS = formatCurrency(totalIncomesARS);

    const totalIncomesUSD = Number(data[1].rows[0].usd_tota ?? '0');
    const totalIncomesCurrencyUSD = formatCurrencyUSD(totalIncomesUSD);

    const total: FinancialRecord[]= [
      {
        outcome: {
          ars: totalOutcomesCurrencyARS,
          usd: totalOutcomesCurrencyUSD,
        },
        income: {
          ars: totalIncomesCurrencyARS,
          usd: totalIncomesCurrencyUSD,
        },
      },
    ];

    return {
      total
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}