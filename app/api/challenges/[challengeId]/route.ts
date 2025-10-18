import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

// ✅ Updated for Next.js 15
export async function GET(
  req: Request,
  { params }: { params: Record<string, string> },
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });

  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Record<string, string> },
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const body = await req.json();
  const updated = await db
    .update(challenges)
    .set({
      ...body,
      scramble_letters: body.scramble_letters ?? null,
    })
    .where(eq(challenges.id, id))
    .returning();

  if (!updated.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

export async function DELETE(
  req: Request,
  { params }: { params: Record<string, string> },
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await db
    .delete(challenges)
    .where(eq(challenges.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}
