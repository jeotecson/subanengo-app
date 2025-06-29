import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { stories } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: { lessonId: number } },
) => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

  const data = await db.query.lessons.findFirst({
    where: eq(stories.id, params.lessonId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: { lessonId: number } },
) => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

  const body = await req.json();
  const data = await db.update(stories).set({
    ...body,
  }).where(eq(stories.id, params.lessonId)).returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: Request,
  { params }: { params: { lessonId: number } },
) => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

  const data = await db.delete(stories)
    .where(eq(stories.id, params.lessonId)).returning();

  return NextResponse.json(data[0]);
};