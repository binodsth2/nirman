import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if any query is currently processing (inputflag: true)
    const query = await prisma.query.findFirst({
      where: { inputflag: true },
      orderBy: { createdAt: "asc" },
    });

    if (!query) {
      return NextResponse.json({ status: "empty", message: "No pending queries found" });
    }

    return NextResponse.json({
      status: "found",
      data: {
        id: query.id,
        input: query.input,
      },
    });
  } catch (error) {
    console.error("Error fetching query:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, output } = await req.json();
    if (!id || !output) {
      return NextResponse.json({ error: "Missing id or output" }, { status: 400 });
    }

    // Update query with id: set output, change inputflag to false meaning it's completed

    await prisma.query.update({
      where: { id }, //OR where: {id:id}
      data: {
        output,
        inputflag: false,
      },
    });
    return NextResponse.json({
      data: { message: "Response added successfully" },
    });
  } catch (error: any) {
    console.error("Error updating query:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
