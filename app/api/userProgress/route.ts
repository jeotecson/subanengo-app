import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

type NewUserProgress = InferInsertModel<typeof userProgress>;

export async function POST() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const name = (sessionClaims as any)?.fullName || "User";
  const image = (sessionClaims as any)?.imageUrl || "/SubanenGo.png";

  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!existing) {
    const newUser: NewUserProgress = {
      userId,
      userName: name,
      userImageSrc: image,
      hearts: 5,
      points: 0,
    };

    await db.insert(userProgress).values(newUser);
  } else {
    await db
      .update(userProgress)
      .set({
        userName: name,
        userImageSrc: image,
      })
      .where(eq(userProgress.userId, userId));
  }

  return new Response("OK", { status: 200 });
}
