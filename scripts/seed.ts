import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
//@ts-ignore

const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);  

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Ginsalugen",
                imageSrc: "/ginsulegan.png",
            },
            {
                id: 2,
                title: "Central Subanen",
                imageSrc: "/centralsubanen.png",
            },
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1,
                title: "Unit 1",
                description: "Learn the basics of Ginsalugen Subanen",
                order: 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: "Basics",
            },
            {
                id: 2,
                unitId: 1,
                order: 2,
                title: "Greetings",
            },
            {
                id: 3,
                unitId: 1,
                order: 3,
                title: "Family",
            },
            {
                id: 4,
                unitId: 1,
                order: 4,
                title: "Animals",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1, //Basics
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "the man"?',
            },
            {
                id: 2,
                lessonId: 1, //Basics
                type: "ASSIST",
                order: 2,
                question: '"the man"?',
            },
            {
                id: 3,
                lessonId: 1, //Basics
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "the woman"?',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imageSrc: "/man.png",
                correct: true,
                text: "Giseg",
                audioSrc: "/audio_man.m4a",
            },
            {
                challengeId: 1,
                imageSrc: "/woman.png",
                correct: false,
                text: "Libun",
                audioSrc: "/audio_woman.m4a",
            },
            {
                challengeId: 1,
                imageSrc: "/dog.png",
                correct: false,
                text: "Gayam",
                audioSrc: "/audio_dog.m4a",
            },
            {
                challengeId: 1,
                imageSrc: "/cat.png",
                correct: false,
                text: "Baru",
                audioSrc: "/audio_cat.m4a",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2,
                correct: true,
                text: "Giseg",
                audioSrc: "/audio_man.m4a",
            },
            {
                challengeId: 2,
                correct: false,
                text: "Libun",
                audioSrc: "/audio_woman.m4a",
            },
            {
                challengeId: 2,
                correct: false,
                text: "Gayam",
                audioSrc: "/audio_dog.m4a",
            },
            {
                challengeId: 2,
                correct: false,
                text: "Baru",
                audioSrc: "/audio_cat.m4a",
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3,
                imageSrc: "/man.png",
                correct: false,
                text: "Giseg",
                audioSrc: "/audio_man.m4a",
            },
            {
                challengeId: 3,
                imageSrc: "/woman.png",
                correct: true,
                text: "Libun",
                audioSrc: "/audio_woman.m4a",
            },
            {
                challengeId: 3,
                imageSrc: "/dog.png",
                correct: false,
                text: "Gayam",
                audioSrc: "/audio_dog.m4a",
            },
            {
                challengeId: 3,
                imageSrc: "/cat.png",
                correct: false,
                text: "Baru",
                audioSrc: "/audio_cat.m4a",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonId: 2, //Basics
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "the man"?',
            },
            {
                id: 5,
                lessonId: 2, //Basics
                type: "ASSIST",
                order: 2,
                question: '"the man"?',
            },
            {
                id: 6,
                lessonId: 2, //Basics
                type: "SELECT",
                order: 3,
                question: 'Which one of these is "the woman"?',
            },
        ]);


        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed database");
    }
};

main();