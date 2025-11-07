import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.challengeProgress),
      db.delete(schema.challengeOptions),
      db.delete(schema.challenges),
      db.delete(schema.lessons),
      db.delete(schema.units),
      db.delete(schema.courses),
    ]);

    const courses = await db
      .insert(schema.courses)
      .values([{ title: "Ginsalugen", imageSrc: "/ginsulegan.png" }])
      .returning();

    const seedChallenges = [
      {
        type: "SELECT" as const,
        order: 1,
        question: 'Which one of these is "the man"?',
      },
      {
        type: "ASSIST" as const,
        order: 2,
        question: '"the man"?',
      },
      {
        type: "SELECT" as const,
        order: 3,
        question: 'Which one of these is "the woman"?',
      },
    ];

    // seedOptions map corresponds by index to seedChallenges entries
    const seedOptions: Array<
      {
        text: string;
        correct: boolean;
        imageSrc?: string;
        audioSrc?: string;
      }[]
    > = [
      // Options for challenge 1 (SELECT - "the man")
      [
        { text: "Giseg", correct: true, imageSrc: "/man.png", audioSrc: "/audio_man.m4a" },
        { text: "Libun", correct: false, imageSrc: "/woman.png", audioSrc: "/audio_woman.m4a" },
        { text: "Gayam", correct: false, imageSrc: "/dog.png", audioSrc: "/audio_dog.m4a" },
        { text: "Baru", correct: false, imageSrc: "/cat.png", audioSrc: "/audio_cat.m4a" },
      ],
      // Options for challenge 2 (ASSIST - '"the man"?')
      [
        { text: "Giseg", correct: true, audioSrc: "/audio_man.m4a" },
        { text: "Libun", correct: false, audioSrc: "/audio_woman.m4a" },
        { text: "Gayam", correct: false, audioSrc: "/audio_dog.m4a" },
        { text: "Baru", correct: false, audioSrc: "/audio_cat.m4a" },
      ],
      // Options for challenge 3 (SELECT - "the woman")
      [
        { text: "Giseg", correct: false, imageSrc: "/man.png", audioSrc: "/audio_man.m4a" },
        { text: "Libun", correct: true, imageSrc: "/woman.png", audioSrc: "/audio_woman.m4a" },
        { text: "Gayam", correct: false, imageSrc: "/dog.png", audioSrc: "/audio_dog.m4a" },
        { text: "Baru", correct: false, imageSrc: "/cat.png", audioSrc: "/audio_cat.m4a" },
      ],
    ];

    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        for (const lesson of lessons) {
          const challengesToInsert = seedChallenges.map((c) => {
            const row: any = {
              lessonId: lesson.id,
              type: c.type,
              question: c.question,
              order: c.order,
            };
            if ("correct_answer" in c) row.correct_answer = (c as any).correct_answer;
            if ("scramble_letters" in c) row.scramble_letters = (c as any).scramble_letters;
            return row;
          });

          const insertedChallenges = await db.insert(schema.challenges).values(challengesToInsert).returning();

          for (let i = 0; i < insertedChallenges.length; i++) {
            const insertedChallenge = insertedChallenges[i];
            const optionsForChallenge = seedOptions[i] ?? [];

            const optionRows = optionsForChallenge.map((opt, idx) => {
              return {
                challengeId: insertedChallenge.id,
                order: idx + 1,
                text: opt.text,
                correct: opt.correct,
                imageSrc: opt.imageSrc ?? null,
                audioSrc: opt.audioSrc ?? null,
              };
            });

            if (optionRows.length > 0) {
              await db.insert(schema.challengeOptions).values(optionRows);
            }
          }
        }
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
