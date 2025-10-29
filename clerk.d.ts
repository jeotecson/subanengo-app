import { Clerk } from "@clerk/nextjs/dist/types/server";

declare global {
  namespace Clerk {
    interface UserPublicMetadata {
      isAdmin?: boolean;
    }
  }
}

export {}; 