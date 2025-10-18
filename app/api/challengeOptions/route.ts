import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const options = await db.query.challengeOptions.findMany();
  return NextResponse.json(options);
}

export async function POST(req: Request) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const newOption = await db.insert(challengeOptions).values(body).returning();
  return NextResponse.json(newOption[0]);
}