import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "./quiz";

const LessonPage = async () => {
    const lessonData = getLesson();
    const userProgressData = getUserProgress();
    //For the shop susbcription
    const userSubscriptionData = getUserSubscription();

    const  [
        lesson, userProgress, userSubscription, //For the shop susbcription
    ] = await Promise.all([
        lessonData, userProgressData, userSubscriptionData, //For the shop susbcription
    ]);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPercentage = lesson.challenges.filter ((challenge) => challenge.completed).length / lesson.challenges.length * 100;

    return (
        <Quiz 
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={userSubscription} //For the shop susbcription
        />
    );
};

export default LessonPage;