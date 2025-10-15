import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { challengeOptionId } = await params;
  const id = Number(challengeOptionId);

  const option = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, id),
  });

  if (!option) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(option);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { challengeOptionId } = await params;
  const id = Number(challengeOptionId);

  const deleted = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}
