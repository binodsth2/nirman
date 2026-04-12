import pool from '@/lib/db';
import { NextResponse } from 'next/server'



export async function GET(){
  // pool.query() borrows a connection, runs the query, returns it to pool
  const { rows } = await pool.query('SELECT * FROM users LIMIT 20');
  return NextResponse.json(rows);
}


export async function POST(req: Request) {
  const { name, email } = await req.json();
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return NextResponse.json(rows[0], { status: 201 });

}



