import { auth } from "@clerk/nextjs/server";

const adminIds = [
"user_2sc5YzPPZ6uXl42r4rzmvcsIgfG",
"user_34MxwSnCyiUn8kRbSi9GjJomdB2",
"user_34MyNNIi75mafzTCTNStg9UfHdm",
];

export const getIsAdmin = async () => {
const { userId } = await auth();

if (!userId) {
return false;
}

return adminIds.indexOf(userId) !== -1;
};