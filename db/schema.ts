import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer, pgEnum, boolean, timestamp } from "drizzle-orm/pg-core";

export const courses = pgTable("courses",{
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) =>({
    userProgress: many(userProgress), 
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade"}).notNull(), 
    order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) =>({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id]
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId], 
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST", "SCRAMBLED"]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade"}).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order"),
    correct_answer: text("correct_answer"),
    scramble_letters: text("scramble_letters"),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
    order: integer("order").notNull(),
    slotOrder: integer("slot_order"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    })
}));

export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    })
}));

export const userProgress = pgTable("user_progress",{
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/SubanenGo.png"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) =>({
    activeCourse: one(courses, { fields: [userProgress.activeCourseId], references: [courses.id] }),
}));

export const vocabulary = pgTable("vocabulary", {
    id: serial("id").primaryKey(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(), 
    word: text("word").notNull(),
    translation: text("translation").notNull(),
    audioSrc: text("audio_src").notNull(),
    slowAudioSrc: text("slow_audio_src").notNull(),
  });

  export const stories = pgTable('stories', {
    id: serial('id').primaryKey(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    storyTitle: text("storyTitle").notNull(),
    story: text("story").notNull(),
    translation: text("translation").notNull(),
    audioSrc: text("audio_src"),
  });
  
  
  
  

