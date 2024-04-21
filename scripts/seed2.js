const { db } = require('@vercel/postgres');
const { incomes } = require('../app/lib/incomes.js');

async function seedExpenses(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS incomes (
    name TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    currency TEXT NOT NULL,
    ars DECIMAL(10,2) NOT NULL,
    tasa INT NOT NULL,
    usd DECIMAL(10,2) NOT NULL
    );
    `;

    const insertedExpenses = await Promise.all(
      incomes.map(async (expense, index) => {
        await client.sql`
        INSERT INTO incomes (name, date, category, currency, ars, tasa, usd)
        VALUES (${expense.name}, ${expense.date}, ${expense.category}, ${expense.currency}, ${expense.ars}, ${expense.tasa}, ${expense.usd})`;
        console.log(`Una más: ${index + 1}`);
      }),
    );

    console.log(`Seeded ${insertedExpenses.lenght} expenses`);

    return {
      createTable,
      incomes: insertedExpenses,
    };
  } catch (error) {
    console.log('Error sending expenses', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedExpenses(client);

  await client.end();
}

main().catch((err) => {
  console.log('Ha ocurrido un error', err);
});
