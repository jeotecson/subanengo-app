import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ModulePage = async () => {
  const [userProgress] = await Promise.all([
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
          <Image src="/module.png" alt="Module" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Modules
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Learn faster with integrated vocabulary, pronunciation, and entertaining stories.
          </p>
        </div>

        <ul className="w-full">
          <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
            <Image src="/vocabulary.png" alt="Vocabulary" height={60} width={60} />
            <div className="flex-1">
              <p className="text-neutral-700 text-base lg:text-xl font-bold">
                Vocabulary
              </p>
            </div>
            <Button asChild>
              <Link href="/modules/vocabulary">Explore</Link>
            </Button>
          </div>

          <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
            <Image src="/stories.png" alt="Stories" height={60} width={60} />
            <div className="flex-1">
              <p className="text-neutral-700 text-base lg:text-xl font-bold">
                Stories
              </p>
            </div>
            <Button asChild>
              <Link href="/modules/story">Read</Link>
            </Button>
          </div>
        </ul>
      </FeedWrapper>
    </div>
  );
};

export default ModulePage;
