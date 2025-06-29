import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { stories } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

 const data = await db.query.stories.findMany();


  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

  const body = await req.json();

  const data = await db.insert(stories).values({
    ...body,
  }).returning();

  return NextResponse.json(data[0]);
};