import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET(
  req: Request,
  context: { params: Record<string, string> }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, id),
  });

  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  context: { params: Record<string, string> }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const body = await req.json();
  const updated = await db
    .update(challengeOptions)
    .set({ ...body })
    .where(eq(challengeOptions.id, id))
    .returning();

  if (!updated.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

export async function DELETE(
  req: Request,
  context: { params: Record<string, string> }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}