// app/api/query/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Request received:::::::::::::::::::::::", req.body);
    const { input } = await req.json();

    if (!input || input.trim() === "") {
      return NextResponse.json({ error: "Empty input" }, { status: 400 });
    }

    // 1. Check if any query is currently processing
    const existing = await prisma.query.findFirst({
      //itself cannot state that the query is at "waiting" because
      //it is only a read operation, not a response operation.
      where: { inputflag: true },
    });

    if (existing) {
      return NextResponse.json({
        status: "waiting",
        message: "Please wait, another request is processing",
      });
    }

    // 2. Insert new query and mark as processing
    const newQuery = await prisma.query.create({
      data: {
        input,
        inputflag: true,
      },
    });

    return NextResponse.json({
      status: "accepted",
      data: newQuery, // rethink and confirm it later
    });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}