// src/types/transcript.ts

export interface TranscriptSegment {
  id: number;

  /** Start time in seconds */
  start: number;

  /** End time in seconds */
  end: number;

  /** Original subtitle text */
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  source: "srt" | "vtt" | "youtube";
}

export interface TranscriptDocument {
   id: string;
  lesson: Lesson;
  language?: string;
  segments: TranscriptSegment[];
}

// export interface LessonMetadata {
//   id: string;
//   title: string;
//   order: number;
//   source: "srt" | "vtt" | "youtube";
// }




// export interface TranscriptDocument {
//   lesson: LessonMetadata;

//   language?: string;
//   lessonName: string;

//   segments: TranscriptSegment[];
// }


// export interface TranscriptDocument {
//   source: "srt" | "vtt" | "youtube";

//   lessonName: string;

//   language?: string;

//   segments: TranscriptSegment[];
// }