import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const { nombre, fecha, categoria, currency, ars, tasa, usd } = formData;

        if (!nombre || !fecha || !categoria || !currency || !ars || !tasa || !usd) {
            throw new Error('All fields are required');
        }

        await sql`INSERT INTO Ingresos (Nombre, Date, Categoría, Currency, ARS, Tasa, USD) VALUES (${nombre}, ${fecha}, ${categoria}, ${currency}, ${ars}, ${tasa}, ${usd})`;
        
        const ingresos = await sql`SELECT * FROM Ingresos`;
        return NextResponse.json({ ingresos }, { status: 200 });
    } catch (error: any) {
        console.error('Error al agregar ingreso:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
