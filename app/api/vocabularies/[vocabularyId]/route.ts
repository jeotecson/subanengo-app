import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { vocabulary } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  context: { params: { vocabularyId: string } }
) => {
  const { vocabularyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.vocabulary.findFirst({
    where: eq(vocabulary.id, parseInt(vocabularyId)),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  context: { params: { vocabularyId: string } }
) => {
  const { vocabularyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = await db
    .update(vocabulary)
    .set({ ...body })
    .where(eq(vocabulary.id, parseInt(vocabularyId)))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: Request,
  context: { params: { vocabularyId: string } }
) => {
  const { vocabularyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db
    .delete(vocabulary)
    .where(eq(vocabulary.id, parseInt(vocabularyId)))
    .returning();

  return NextResponse.json(data[0]);
};
