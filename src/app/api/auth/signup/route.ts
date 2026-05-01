import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  
  const { name, email, password} = await req.json();
  console.log(name, email, password );
  prisma.user.create({
    data: {
      name, email, password
    }
  })
  return new Response (JSON.stringify({ message:"User Registered Sucesfully" }), { status: 201 });
}