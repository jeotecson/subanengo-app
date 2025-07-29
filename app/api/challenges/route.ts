import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

  const data = await db.query.challenges.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
 if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 401 });
 };

const body = await req.json();
const { question, type, lessonId, order, correct_answer, scramble_letters } = body;

const data = await db.insert(challenges).values({
  question,
  type,
  lessonId,
  order,
  correct_answer: correct_answer ?? null,
  scramble_letters: scramble_letters ?? null,
}).returning();


  return NextResponse.json(data[0]);
};