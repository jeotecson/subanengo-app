import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getIsAdmin } from "@/lib/admin";

export async function GET(
  _req: Request,
  context: { params: { challengeOptionId: string } }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (Number.isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const option = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, id),
  });

  if (!option) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(option);
}

export async function DELETE(
  _req: Request,
  context: { params: { challengeOptionId: string } }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (Number.isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, id))
    .returning();

  if (!deleted.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}
