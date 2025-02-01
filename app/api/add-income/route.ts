import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const { name, date, category, currency, ars, tasa, usd } = formData;

        if (!name || !date || !category || !currency || !ars || !tasa || !usd) {
            throw new Error('All fields are required');
        }

        await sql`INSERT INTO incomes (name, date, category, currency, ars, tasa, usd) VALUES (${name}, ${date}, ${category}, ${currency}, ${ars}, ${tasa}, ${usd})`;
        
        const incomes = await sql`SELECT * FROM incomes`;
        return NextResponse.json({ incomes }, { status: 200 });
    } catch (error: any) {
        console.error('Error creating income:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
