// src/course/CourseLoader.ts
import fs from "fs/promises";
import path from "path";

import { Course, CourseLesson } from "./Course";

export class CourseLoader {

    

    async load(
    directory: string,
    courseId: string,
    courseTitle: string
): Promise<Course> {

    const files = await fs.readdir(directory);

    const transcriptMap = new Map<string, string>();

    for (const file of files) {

        const ext = path.extname(file);

        if (ext !== ".srt" && ext !== ".vtt") {
            continue;
        }

        const baseName = path.basename(file, ext);

        // Prefer SRT over VTT
        if (!transcriptMap.has(baseName) || ext === ".srt") {
            transcriptMap.set(baseName, file);
        }
    }

    const transcriptFiles = [...transcriptMap.values()].sort();

    const lessons: CourseLesson[] = transcriptFiles.map((file, index) => ({

        id: `lesson-${String(index + 1).padStart(3, "0")}`,

        title: path.parse(file).name,

        order: index + 1,

        filePath: path.join(directory, file),

        source: file.endsWith(".vtt") ? "vtt" : "srt",

    }));

    return {

        id: courseId,

        title: courseTitle,

        lessons,

    };

}

}