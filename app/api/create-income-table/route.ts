import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const result =
      await sql`CREATE TABLE Ingresos ( Nombre varchar(255), Date DATE, Categoría varchar(255), Currency varchar(3), ARS DECIMAL(10,2), Tasa DECIMAL(10,2), USD DECIMAL(10,2) );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
