const { db } = require('@vercel/postgres');
const { expenses } = require('../app/lib/expenses-data.js');

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function seedExpenses(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS expensitos (
      name TEXT NOT NULL,
      date DATE NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      quotestatus INT NOT NULL,
      quotenumber INT NOT NULL,
      ars DECIMAL(10,2) NOT NULL,
      tasa DECIMAL(10,2) NOT NULL,
      usd DECIMAL(10,2) NOT NULL
    );
    `;

    const insertedExpenses = await Promise.all(
      expenses.map(async (expense, index) => {
        const formattedDate = formatDate(expense.date);
        await client.sql`
        INSERT INTO expensitos (name, date, category, type, quotestatus, quotenumber, ars, tasa, usd)
        VALUES (${expense.name}, ${formattedDate}, ${expense.category}, ${expense.type}, ${Math.floor(expense.quotestatus)}, ${Math.floor(expense.quotenumber)}, ${expense.ars}, ${Math.floor(expense.tasa)}, ${expense.usd})`;
        console.log(`Una más: ${index + 1}`);
      }),
    );

    console.log(`Seeded ${insertedExpenses.length} expenses`);

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
