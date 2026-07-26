// src/parsers/BaseSubtitleParser.ts

import {
  ParseOptions,
  TranscriptDocument,
  TranscriptParser,
  TranscriptSegment,
} from "../types";

import { timestampToSeconds } from "../utils";

export abstract class BaseSubtitleParser implements TranscriptParser {
  parse(
    content: string,
    options: ParseOptions
  ): TranscriptDocument {

    const normalized = this.preprocess(content);

    const blocks = normalized
      .trim()
      .split(/\r?\n\r?\n/);

    const segments: TranscriptSegment[] = [];

    let autoId = 1;

    for (const block of blocks) {

      const segment = this.parseBlock(block, autoId);

      if (!segment) continue;

      segments.push(segment);

      autoId++;

    }

    return {
      id: options.lesson.id, 
      lesson: options.lesson,
      language: options.language,
      segments,
    };

  }

  protected abstract preprocess(content: string): string;

  protected abstract parseBlock(
    block: string,
    id: number
  ): TranscriptSegment | null;

  protected createSegment(
    id: number,
    start: string,
    end: string,
    text: string
  ): TranscriptSegment {

    return {
      id,
      start: timestampToSeconds(start),
      end: timestampToSeconds(end),
      text: text.trim(),
    };

  }

}