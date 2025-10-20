import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { stories } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  context: { params: Promise<{ storyId: string }> }
) => {
  const { storyId } = await context.params;

  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = parseInt(storyId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const data = await db.query.stories.findFirst({
    where: eq(stories.id, id),
  });

  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  context: { params: Promise<{ storyId: string }> }
) => {
  const { storyId } = await context.params;

  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = parseInt(storyId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const body = await req.json();
  const updated = await db
    .update(stories)
    .set({ ...body })
    .where(eq(stories.id, id))
    .returning();

  if (!updated.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(updated[0]);
};

export const DELETE = async (
  req: Request,
  context: { params: Promise<{ storyId: string }> }
) => {
  const { storyId } = await context.params;

  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = parseInt(storyId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await db
    .delete(stories)
    .where(eq(stories.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
};
