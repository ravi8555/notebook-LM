// src/course/CourseIndexingService.ts

import { Course } from "./Course";
import { TranscriptProcessor } from "./TranscriptProcessor";

import { IndexingService } from "../services";
import { DocumentChunk } from "../types";

export class CourseIndexingService {

   constructor(

        private readonly processor: TranscriptProcessor,

        private readonly indexing: IndexingService

    ) {}

    
    async rebuildCourse(course: Course): Promise<DocumentChunk[]> {

        console.log();
        console.log(`🚀 Indexing "${course.title}"`);
        console.log();

        const allChunks: DocumentChunk[] = [];

        for (const lesson of course.lessons) {

            const chunks =
    await this.processor.process(
        course,
        lesson
    );

            console.log(
                `✅ ${lesson.title} (${chunks.length} chunks)`
            );

            allChunks.push(...chunks);
        }

        console.log();
        console.log(`📦 Total chunks: ${allChunks.length}`);
        console.log();

        await this.indexing.rebuild(allChunks);

        console.log();
        console.log("🎉 Course indexing completed!");

        return allChunks
    }

    



}