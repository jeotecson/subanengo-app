import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { vocabulary } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { AudioButtons } from "@/components/vocabulary/audio-buttons"; 
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


type Props = {
  params: {
    unitId: string;
  };
};

const UnitVocabularyPage = async ({ params }: Props) => {
  const unitId = Number(params.unitId);
  const userProgress = await getUserProgress();

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }


  const vocabularies = await db.query.vocabulary.findMany({
    where: eq(vocabulary.unitId, unitId),
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
          <Link href="/modules/vocabulary">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Vocabulary</h1>
          <div />
        </div>
  
        <FeedWrapper>
          <ul className="space-y-6 w-full">
            {vocabularies.length === 0 ? (
              <p className="text-muted-foreground text-center">No vocabulary found.</p>
            ) : (
              vocabularies.map((vocab) => (
                <li key={vocab.id} className="border p-4 rounded-lg shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{vocab.word}</p>
                      <p className="text-muted-foreground">{vocab.translation}</p>
                    </div>
                    <AudioButtons
                      audioSrc={vocab.audioSrc}
                      slowAudioSrc={vocab.slowAudioSrc}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </FeedWrapper>
      </div>
    </div>
  );
  
  
};

export default UnitVocabularyPage;
