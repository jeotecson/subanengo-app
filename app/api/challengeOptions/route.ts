import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/admin";

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const option = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, Number(context.params.challengeOptionId)),
  });

  if (!option) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(option);
}

export async function POST(
  req: Request,
  context: { params: Record<string, string> }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const newOption = await db
    .insert(challengeOptions)
    .values({ ...body, id: Number(context.params.challengeOptionId) })
    .returning();

  return NextResponse.json(newOption[0]);
}