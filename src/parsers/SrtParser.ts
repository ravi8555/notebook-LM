// src/parsers/SrtParser.ts

import { TranscriptSegment } from "../types";

import { BaseSubtitleParser } from "./BaseSubtitleParser";

export class SrtParser extends BaseSubtitleParser {

  protected preprocess(content: string): string {
    return content.trim();
  }

  protected parseBlock(
    block: string,
    autoId: number
  ): TranscriptSegment | null {

    const lines = block
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 3)
      return null;

    const id = Number(lines[0]);

    const [start, end] =
      lines[1]
        .split("-->")
        .map(t => t.trim());

    const text =
      lines
        .slice(2)
        .join(" ");

    return this.createSegment(
      Number.isNaN(id) ? autoId : id,
      start,
      end,
      text
    );

  }

}