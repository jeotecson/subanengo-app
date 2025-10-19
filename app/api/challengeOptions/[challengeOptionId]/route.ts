import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

type Params = { challengeOptionId: string };

export async function GET(
  req: NextRequest,
  context: { params: Params }
) {
  if (!(await getIsAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = Number(context.params.challengeOptionId);
  if (isNaN(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, id),
  });

  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(data);
}
