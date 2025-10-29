import { auth, clerkClient } from "@clerk/nextjs/server";

export const getIsAdmin = async () => {
  const { userId } = await auth();

  if (!userId) return false;

  const user = await clerkClient.users.getUser(userId);
  return user.privateMetadata.role === "admin";
};
