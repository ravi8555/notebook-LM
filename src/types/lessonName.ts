export interface LessonMetadata {
  id: string;

  title: string;

  order: number;

  duration?: number;

  source: "srt" | "vtt" | "youtube";
}