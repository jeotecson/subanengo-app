import { auth } from "@clerk/nextjs/server";

const adminIds = [
  "user_2sc5YzPPZ6uXl42r4rzmvcsIgfG",
];

export const getIsAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
