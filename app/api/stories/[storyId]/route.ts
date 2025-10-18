import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { stories } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  context: { params: { storyId: string } }
) => {
  const { storyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.stories.findFirst({
    where: eq(stories.id, parseInt(storyId)),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  context: { params: { storyId: string } }
) => {
  const { storyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const data = await db
    .update(stories)
    .set({ ...body })
    .where(eq(stories.id, parseInt(storyId)))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  req: Request,
  context: { params: { storyId: string } }
) => {
  const { storyId } = context.params;

  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db
    .delete(stories)
    .where(eq(stories.id, parseInt(storyId)))
    .returning();

  return NextResponse.json(data[0]);
};
