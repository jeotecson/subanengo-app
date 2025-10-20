import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { vocabulary } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET(req: Request, context: { params: Promise<{ vocabularyId: string }> }) {
  const { vocabularyId } = await context.params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const word = await db.query.vocabulary.findFirst({ where: eq(vocabulary.id, Number(vocabularyId)) });
  return word ? NextResponse.json(word) : new NextResponse("Not Found", { status: 404 });
}

export async function PUT(req: Request, context: { params: Promise<{ vocabularyId: string }> }) {
  const { vocabularyId } = await context.params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const updated = await db.update(vocabulary).set(body).where(eq(vocabulary.id, Number(vocabularyId))).returning();
  return updated.length ? NextResponse.json(updated[0]) : new NextResponse("Not Found", { status: 404 });
}

export async function DELETE(req: Request, context: { params: Promise<{ vocabularyId: string }> }) {
  const { vocabularyId } = await context.params;
  if (!(await getIsAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const deleted = await db.delete(vocabulary).where(eq(vocabulary.id, Number(vocabularyId))).returning();
  return deleted.length ? NextResponse.json(deleted[0]) : new NextResponse("Not Found", { status: 404 });
}
