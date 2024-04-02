const { db } = require('@vercel/postgres');
const { expenses } = require('../app/lib/expenses.js');

async function seedExpenses(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS expenses (
    name TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    quoteStatus VARCHAR(255) NOT NULL,
    quoteNumber VARCHAR(255) NOT NULL,
    ars VARCHAR(255) NOT NULL,
    exchangeRate VARCHAR(255) NOT NULL,
    usd VARCHAR(255) NOT NULL
    );
    `;

    const insertedExpenses = await Promise.all(
      expenses.map(async (expense, index) => {
        await client.sql`
        INSERT INTO expenses (name, date, category, type, quoteStatus, quoteNumber, ars, exchangeRate, usd)
        VALUES (${expense.nombre}, ${expense.date}, ${expense.categoria}, ${expense.type}, ${expense.quoteStatus}, ${expense.quoteNumber}, ${expense.ars}, ${expense.tasa}, ${expense.usd})`;
        console.log(`Una más: ${index +1}`)
      }),
    );

    console.log(`Seeded ${insertedExpenses.lenght} expenses`);

    return {
      createTable,
      expenses: insertedExpenses,
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
