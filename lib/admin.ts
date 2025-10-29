// lib/admin.ts
import { auth } from "@clerk/nextjs/server";

export const getIsAdmin = async () => {
  const { sessionClaims } = await auth();

  //If there's no session, the user is not logged in, so they can't be an admin.
  if (!sessionClaims) {
    return false;
  }

  return sessionClaims?.publicMetadata?.isAdmin === true;
};