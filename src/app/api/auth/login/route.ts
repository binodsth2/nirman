import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const { email, password } = await req.json();
    console.log(email, password);
    // Here you would typically check the credentials against your database
    // For demonstration, we'll just return a success message
    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
}