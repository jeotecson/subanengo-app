import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress } from "@/db/queries";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";
import { RefillHeartsButton } from "@/components/refill-hearts-button";

const QuestsPage = async () => {
  const userProgressData = getUserProgress();

  const [userProgress] = await Promise.all([userProgressData]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return ( 
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/quest.png"
            alt="Quests"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Quests
          </h1>
          <p className="text-muted-foreground text-tcenter text-lg mb-6">
            Complete quests by earning points.
          </p>

          <ul className="w-full">
            {quests.map((quest) => {
              const progress = (userProgress.points / quest.value) * 100;

              return (
                <div
                  className="flex items-center w-full p-4 gap-x-4 border-t-2"
                  key={quest.title}
                >
                  <Image
                    src="/points.png"
                    alt="Points"
                    width={60}
                    height={60}
                  />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-xl font-bold">
                      {quest.title}
                    </p>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              );
            })}

            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
              <Image src="/heart.png" alt="Heart" height={60} width={60} />
              <div className="flex-1">
                <p className="text-neutral-700 text-base lg:text-xl font-bold">
                  Refill hearts
                </p>
              </div>
              <RefillHeartsButton
                hearts={userProgress.hearts}
                points={userProgress.points}
              />
            </div>
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
