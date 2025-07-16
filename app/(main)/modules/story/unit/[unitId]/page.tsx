import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { stories } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AudioButtons } from "@/components/story/story-audio-buttons";

type Props = {
  params: {
    unitId: string;
  };
};

const UnitStoryPage = async ({ params }: Props) => {
  const unitId = Number(params.unitId);
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const storyList = await db.query.stories.findMany({
    where: eq(stories.unitId, unitId),
  });

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
        />
      </StickyWrapper>

      <div className="flex flex-col flex-1">
        <div className="sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-500 lg:z-50">
          <Link href="/modules/story">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Story</h1>
          <div />
        </div>

        <FeedWrapper>
          <ul className="space-y-6 w-full">
            {storyList.length === 0 ? (
              <p className="text-muted-foreground text-center">No stories found.</p>
            ) : (
              storyList.map((stor) => (
                <li key={stor.id} className="border p-4 rounded-lg shadow-sm space-y-4">
                  <div>
                  <div className="flex justify-center items-center h-full">
                    <h1 className="font-semibold text-2xl">{stor.storyTitle}</h1>
                  </div>
                  <hr className="my-2 border-muted" />
                    <p className="font-semibold text-lg">{stor.story}</p>
                    <hr className="my-2 border-muted" />
                    <p className="text-muted-foreground">{stor.translation}</p>
                  </div>
                  {stor.audioSrc && (
                    <div className="flex justify-start">
                      <AudioButtons audioSrc={stor.audioSrc} />
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </FeedWrapper>
      </div>
    </div>
  );
};

export default UnitStoryPage;
