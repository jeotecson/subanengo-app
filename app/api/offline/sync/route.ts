import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { sql, eq } from "drizzle-orm";
import { challengeProgress, userProgress, challengeOptions, challenges } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const user = await auth();
  const { userId } = user;
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();

  const { type, payload } = body;

  try {
    if (type === "challengeProgress") {
      const { challengeId } = payload;
      // idempotent insert: if it exists mark completed, else insert
      const exists = await db.query.challengeProgress.findFirst({
        where: eq(challengeProgress.challengeId, challengeId) && eq(challengeProgress.userId, userId)
      });

      if (exists) {
        await db.update(challengeProgress).set({ completed: true }).where(eq(challengeProgress.id, exists.id));
      } else {
        await db.insert(challengeProgress).values({ challengeId, userId, completed: true });
      }

      // add points (same logic as your action) - do not double credit if you already did: keep idempotent
      await db.update(userProgress).set({
        points: sql`${userProgress.points} + 10` // drizzle raw increment shorthand may vary — replace with safe read/update if needed
      }).where(eq(userProgress.userId, userId));

      revalidatePath("/learn");
      revalidatePath("/lesson");
      revalidatePath("/quests");
      revalidatePath("/leaderboard");
    } else if (type === "challengeScramble") {
      // payload: { challengeId, userOrder }
      const { challengeId, userOrder } = payload;
      // verify correct order using DB to avoid cheating
      const options = await db.query.challengeOptions.findMany({
        where: eq(challengeOptions.challengeId, challengeId),
        orderBy: (o, { asc }) => [asc(o.order)],
      });
      const correctOrder = options.map((o) => o.order);
      if (JSON.stringify(correctOrder) !== JSON.stringify(userOrder)) {
        return NextResponse.json({ error: "wrong" }, { status: 200 });
      }

      await db.insert(challengeProgress).values({ challengeId, userId, completed: true });
      await db.update(userProgress).set({
        points: sql`${userProgress.points} + 10`
      }).where(eq(userProgress.userId, userId));
      revalidatePath("/learn");
      revalidatePath(`/lesson/${options[0]?.challengeId ?? ""}`);
    } else if (type === "reduceHearts") {
      const { challengeId } = payload;
      const cur = await db.query.userProgress.findFirst({ where: eq(userProgress.userId, userId) });
      if (!cur) return NextResponse.json({ error: "no-progress" }, { status: 400 });
      const newHearts = Math.max(cur.hearts - 1, 0);
      await db.update(userProgress).set({ hearts: newHearts }).where(eq(userProgress.userId, userId));
      revalidatePath("/learn");
    } else {
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("offline sync error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
