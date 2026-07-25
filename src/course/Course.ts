// src/course/Course.ts

export interface CourseLesson {

    id: string;

    title: string;

    order: number;

    filePath: string;

    source: "srt" | "vtt";

}

export interface Course {

    id: string;

    title: string;

    lessons: CourseLesson[];

}