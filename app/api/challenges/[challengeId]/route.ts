import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET(
  _req: Request,
  { params }: { params: { challengeId: string } }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);

  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
  });

  if (!data) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(data);
}

// ✅ PUT: Update a challenge by ID
export async function PUT(
  req: Request,
  { params }: { params: { challengeId: string } }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);
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
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

// ✅ DELETE: Delete a challenge by ID
export async function DELETE(
  _req: Request,
  { params }: { params: { challengeId: string } }
) {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(params.challengeId);

  const deleted = await db
    .delete(challenges)
    .where(eq(challenges.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}
