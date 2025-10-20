import { NextRequest, NextResponse } from "next/server";
import { getIsAdmin } from "@/lib/admin";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";

export async function GET(req: NextRequest) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.courses.findMany();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const created = await db.insert(courses).values(body).returning();

  return NextResponse.json(created[0]);
}
