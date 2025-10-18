import { NextResponse, type RouteHandler } from "next/server";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET: RouteHandler = async (req, context) => {
  const { params } = context as { params: { challengeId: string } };

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
};

export const PUT: RouteHandler = async (req, context) => {
  const { params } = context as { params: { challengeId: string } };

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
};

export const DELETE: RouteHandler = async (_req, context) => {
  const { params } = context as { params: { challengeId: string } };

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
};
