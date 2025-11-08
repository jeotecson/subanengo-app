import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Fixing user data from Clerk...\n");

    const allUsers = await db.query.userProgress.findMany();
    const clerk = await clerkClient();

    for (const userProg of allUsers) {
      try {
        const clerkUser = await clerk.users.getUser(userProg.userId);

        await db
          .update(schema.userProgress)
          .set({
            userName: clerkUser.fullName || clerkUser.firstName || "User",
            userImageSrc: clerkUser.imageUrl,
          })
          .where(eq(schema.userProgress.userId, userProg.userId));

        console.log(`Updated: ${clerkUser.fullName || clerkUser.firstName} (${userProg.userId})`);
      } catch (error) {
        console.error(`Failed to update user ${userProg.userId}:`, error);
      }
    }

    console.log("\n All users updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fix user data");
  }
};

main();