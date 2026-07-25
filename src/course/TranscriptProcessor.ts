// src/course/TranscriptProcessor.ts
import fs from 'fs/promises'
import path from 'path'

import { CourseLesson, Course } from './Course'

import { SrtParser } from '../parsers/SrtParser'
import { VttParser } from '../parsers/VttParser'

import { TranscriptCleaner } from '../cleaner'
import { SemanticChunker } from '../chunking'

import { DocumentChunk } from '../types'

export class TranscriptProcessor {
  private readonly cleaner = new TranscriptCleaner()

  private readonly chunker = new SemanticChunker()

  async process(
    course: Course,
    lesson: CourseLesson,
  ): Promise<DocumentChunk[]> {
    console.log(`📄 Processing ${lesson.title}`)

    const content = await fs.readFile(lesson.filePath, 'utf8')

    const parser =
      path.extname(lesson.filePath) === '.vtt'
        ? new VttParser()
        : new SrtParser()

    const transcript = parser.parse(content, {
      lesson: {
        id: lesson.id,

        title: lesson.title,

        order: lesson.order,

        source: lesson.source,
      },
    })

    const cleaned = this.cleaner.clean(transcript)  
     
    const chunks = this.chunker.chunk(cleaned);

chunks.forEach(chunk => {
    chunk.metadata.courseId = course.id;
    chunk.metadata.courseTitle = course.title;
    chunk.metadata.lessonId = lesson.id;
    chunk.metadata.lessonTitle = lesson.title;
    chunk.metadata.lessonOrder = lesson.order;
});

return chunks;
  }
}
