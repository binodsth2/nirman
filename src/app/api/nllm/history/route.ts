import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "5");

    const history = await prisma.query.findMany({
      skip,
      take,
      where: {
        inputflag: false,
        output: { not: null },
      },
      orderBy: { createdAt: "desc" },

      //Adding some selected feild
      select: {
        id: true,
        input: true,
        output: true,
        createdAt: true,
        updatedAt: true,
      }

    });
    // console.log("History fetched::::::::::::::::::::::::::", history);
    return NextResponse.json({
      status: "success",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
