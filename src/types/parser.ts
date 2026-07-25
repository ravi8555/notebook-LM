// src/types/parser.ts
import { TranscriptDocument, Lesson } from "./transcript";

// export interface TranscriptParser{
//     parse(filePath:string):Promise<TranscriptDocument>
// }

export interface ParseOptions {
  lesson: Lesson;

  language?: string;
}

export interface TranscriptParser {
  parse(
    content: string,
    options: ParseOptions
  ): TranscriptDocument;
}