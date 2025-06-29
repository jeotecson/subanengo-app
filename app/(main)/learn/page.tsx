import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { title } from "process";
import { getUnits, getUserProgress, getCourseProgress, getLessonPercentage, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LearnPage = async () => {
    const userProgressData = getUserProgress();
    const courseProgressData = getCourseProgress();
    const lessonPercentageData = getLessonPercentage();
    const unitsData = getUnits();
    //For the shop susbcription
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        units,
        courseProgress,
        lessonPercentage,
        //For the shop susbcription
        userSubscription,

    ] = await Promise.all([userProgressData, unitsData, courseProgressData, lessonPercentageData, userSubscriptionData]); //For the shop susbcription

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    if (!courseProgress) {
        redirect("/courses");
    }

    //For the shop susbcription
    const isPro = !!userSubscription?.isActive; 

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6"> 
            <StickyWrapper>
                <UserProgress 
                activeCourse = {userProgress.activeCourse}
                hearts = {userProgress.hearts}
                points = {userProgress.points}
                hasActiveSubscriptions = {isPro} //For the shop susbcription
                />

                {/* For the shop susbcription */}
                {!isPro && (
                    <Promo />
                )}
                <Quests points={userProgress.points}/>

            </StickyWrapper>
            <FeedWrapper>
                <Header title = {userProgress.activeCourse.title}/>
                {units.map((unit) => (
                    <div key ={unit.id} className="mb-10">
                        <Unit 
                            id = {unit.id}
                            order = {unit.order}
                            description = {unit.description}
                            title = {unit.title}
                            lessons = {unit.lessons}
                            activeLesson = {courseProgress.activeLesson}
                            activeLessonPercentage = {lessonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;