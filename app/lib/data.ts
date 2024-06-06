"use server"

import { sql } from '@vercel/postgres';
import {
  LatestIncome,
  LatestOutcome,
  FinancialRecord,
} from './definitions';
import { formatCurrency, formatCurrencyUSD, formatCurrencyARS } from './utils';
import { unstable_noStore as noStore } from 'next/cache';


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
export async function fetchCardData(): Promise<{ total: FinancialRecord[] }> {
  try {
    const outcomesPromise = sql`SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM expenses`;
    const incomesPromise = sql`SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM incomes`;

    const data = await Promise.all([outcomesPromise, incomesPromise]);

    // Outcomes ARS / USD
    const totalOutcomesARS = Number(data[0].rows[0].ars_total ?? '0');
    const totalOutcomesCurrencyARS = formatCurrencyARS(totalOutcomesARS);

    const totalOutcomesUSD = Number(data[0].rows[0].usd_total ?? '0');
    const totalOutcomesCurrencyUSD = formatCurrencyUSD(totalOutcomesUSD);

    // Incomes ARS / USD
    const totalIncomesARS = Number(data[1].rows[0].ars_total ?? '0');
    const totalIncomesCurrencyARS = formatCurrencyARS(totalIncomesARS);

    const totalIncomesUSD = Number(data[1].rows[0].usd_total ?? '0');
    const totalIncomesCurrencyUSD = formatCurrencyUSD(totalIncomesUSD);

    const total: FinancialRecord[] = [
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

    return { total };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}