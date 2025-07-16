import { getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";

const ExploreUnitsPage = async () => {
  const [units, userProgress] = await Promise.all([
    getUnits(),
    getUserProgress(),
  ]);

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
            src="/vocabulary.png"
            alt="Vocabulary"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Vocabulary Units
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Unlock and explore vocabulary from each lesson.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map((unit) => {
            const isUnlocked = unit.lessons.some((lesson) => lesson.completed);

            return (
              <Button
                key={unit.id}
                asChild
                disabled={!isUnlocked}
                variant={isUnlocked ? "secondary" : "danger"}
                className="w-full"
              >
                {isUnlocked ? (
                  <Link href={`/modules/vocabulary/unit/${unit.id}`}>
                    {unit.title}
                  </Link>
                ) : (
                  <span>{unit.title} (Locked)</span>
                )}
              </Button>
            );
          })}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ExploreUnitsPage;
