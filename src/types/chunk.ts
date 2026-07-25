// src/types/chunk.ts

export interface ChunkMetadata {

    // Course (added later by TranscriptProcessor)

    courseId?: string;

    courseTitle?: string;

    // Lesson

    lessonId?: string;

    lessonTitle: string;

    lessonOrder?: number;

    // Transcript

    source: "srt" | "vtt" | "youtube";

    segmentIds: number[];

    tokenCount: number;

    duration: number;
}

export interface DocumentChunk {
  id: string;

  documentId: string;

  lessonId: string;

  start: number;

  end: number;

  text: string;

  metadata: ChunkMetadata;
}
export interface SearchFilter {
    courseId?: string;
    lessonId?: string;
}