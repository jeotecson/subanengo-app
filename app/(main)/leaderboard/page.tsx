import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Quests } from "@/components/quests";
import { getCachedData, setCachedData } from "@/lib/cache";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { userProgress as userProgressSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

type LeaderboardEntry = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
};

const LeaderboardPage = async () => {
  const user = await currentUser();
  const userProgressData = getUserProgress();

  let leaderboard: LeaderboardEntry[] | null = null;

  try {
    const freshData = await getTopTenUsers();
    leaderboard = freshData;
    await setCachedData("leaderboard", freshData);
  } catch (error) {
    console.log("Failed to fetch leaderboard, falling back to cache.");
    const cachedData = await getCachedData("leaderboard");
    leaderboard = cachedData as LeaderboardEntry[] | null;
  }

  const [userProgress] = await Promise.all([userProgressData]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (user && userProgress) {
    try {
      await db
        .update(userProgressSchema)
        .set({
          userName: user.fullName || user.firstName || "User",
          userImageSrc: user.imageUrl,
        })
        .where(eq(userProgressSchema.userId, user.id));
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  }

  if (!leaderboard) {
    return (
      <div className="flex flex-row-reverse gap-[48px] px-6">
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
          />
          <Quests points={userProgress.points} hearts={userProgress.hearts} />
        </StickyWrapper>
        <FeedWrapper>
          <div className="w-full flex flex-col items-center">
            <Image
              src="/leaderboard.png"
              alt="Leaderboard"
              height={90}
              width={90}
            />
            <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
              Leaderboard
            </h1>
            <p className="text-muted-foreground text-center text-lg mb-6">
              Leaderboard is unavailable offline. Please connect to the
              internet to see the latest rankings.
            </p>
          </div>
        </FeedWrapper>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
        <Quests points={userProgress.points} hearts={userProgress.hearts} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/leaderboard.png"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-yellow-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-yellow-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage
                  className="object-cover"
                  src={entry.userImageSrc}
                />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">
                {entry.userName}
              </p>
              <p className="text-muted-foreground">{entry.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;