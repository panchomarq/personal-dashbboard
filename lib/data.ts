"use server"

import { sql } from '@vercel/postgres';
import {
  LatestIncome,
  LatestOutcome,
  FinancialRecord,
} from './types/definitions';
import { formatCurrency, formatCurrencyUSD, formatCurrencyARS } from '@/lib/utils';

// Traemos los últimos Outcomes
export async function fetchLatestOutcomes() {
  try {
    const data = await sql<LatestOutcome>`
      SELECT name, category, usd, date
      FROM expenses
      ORDER BY usd DESC
      LIMIT 5`;

    return data.rows.map((outcome) => ({
      ...outcome,
      amount: formatCurrency(outcome.usd),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest outcomes.');
  }
}

// Traemos los últimos Incomes
export async function fetchLatestIncomes() {
  try {
    const query = await sql<LatestIncome>`
      SELECT name, category, usd, date, ars
      FROM incomes
      ORDER BY date DESC
      LIMIT 5`;

    const data = query.rows.map((income) => ({
      ...income,
      usd: Number(formatCurrencyUSD(income.usd)),
      ars: Number(formatCurrencyARS(income.ars)),
    }));

    console.log("***************", data, "***************")
    
    return {data};
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest incomes.');
  }
}

// Traemos datos de las tarjetas
export async function fetchCardData(): Promise<{ total: FinancialRecord[] }> {
  try {
    const outcomesPromise = sql`
      SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM expenses
    `;
    const incomesPromise = sql`
      SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM incomes
    `;

    const [outcomesData, incomesData] = await Promise.all([outcomesPromise, incomesPromise]);

    const totalOutcomesARS = Number(outcomesData.rows[0].ars_total ?? '0');
    const totalOutcomesUSD = Number(outcomesData.rows[0].usd_total ?? '0');
    const totalIncomesARS = Number(incomesData.rows[0].ars_total ?? '0');
    const totalIncomesUSD = Number(incomesData.rows[0].usd_total ?? '0');

    const total: FinancialRecord[] = [
      {
        outcome: {
          ars: formatCurrencyARS(totalOutcomesARS),
          usd: formatCurrencyUSD(totalOutcomesUSD),
        },
        income: {
          ars: formatCurrencyARS(totalIncomesARS),
          usd: formatCurrencyUSD(totalIncomesUSD),
        },
      },
    ];

    return { total };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// En tu archivo de datos (por ejemplo, lib/data.ts)

export async function fetchCardData2(startDate: Date | null, endDate: Date | null): Promise<{ total: FinancialRecord[] }> {
  try {
    const start = startDate ? startDate.toISOString().split('T')[0] : undefined;
    const end = endDate ? endDate.toISOString().split('T')[0] : undefined;

    const outcomesPromise = sql`
      SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM expenses
      WHERE date >= ${start} AND date <= ${end}
    `;
    const incomesPromise = sql`
      SELECT SUM(ars) AS ars_total, SUM(usd) AS usd_total FROM incomes
      WHERE date >= ${start} AND date <= ${end}
    `;

    const [outcomesData, incomesData] = await Promise.all([outcomesPromise, incomesPromise]);

    const totalOutcomesARS = Number(outcomesData.rows[0].ars_total ?? '0');
    const totalOutcomesUSD = Number(outcomesData.rows[0].usd_total ?? '0');
    const totalIncomesARS = Number(incomesData.rows[0].ars_total ?? '0');
    const totalIncomesUSD = Number(incomesData.rows[0].usd_total ?? '0');

    const total: FinancialRecord[] = [
      {
        outcome: {
          ars: formatCurrencyARS(totalOutcomesARS),
          usd: formatCurrencyUSD(totalOutcomesUSD),
        },
        income: {
          ars: formatCurrencyARS(totalIncomesARS),
          usd: formatCurrencyUSD(totalIncomesUSD),
        },
      },
    ];

    return { total };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
