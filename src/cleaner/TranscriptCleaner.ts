// src/cleaner/TranscriptCleaner.ts

import { TranscriptDocument } from "../types";

export class TranscriptCleaner {
  clean(document: TranscriptDocument): TranscriptDocument {
    const cleanedSegments = document.segments
      .map((segment) => ({
        ...segment,
        text: this.cleanText(segment.text),
      }))
      .filter((segment) => segment.text.length > 0);

    return {
      ...document,
      segments: cleanedSegments,
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\[.*?\]/g, "")       // [Music]
      .replace(/♪/g, "")             // ♪
      .replace(/\s+/g, " ")          // Multiple spaces
      .trim();
  }
}