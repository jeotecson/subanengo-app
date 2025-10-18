import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/admin";

// GET a single challenge option by ID
export async function GET(
  request: Request,
  { params }: { params: { challengeOptionId: string } }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const option = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, Number(params.challengeOptionId)),
  });

  if (!option) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(option);
}

// POST is not typical for a dynamic route, but here's an example if you need it
export async function POST(
  req: Request,
  { params }: { params: { challengeOptionId: string } }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  // You can use params.challengeOptionId here if needed
  const newOption = await db
    .insert(challengeOptions)
    .values({ ...body, id: Number(params.challengeOptionId) })
    .returning();

  return NextResponse.json(newOption[0]);
}