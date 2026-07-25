// // src/parsers/VttParser.ts

// import {
//   ParseOptions,
//   TranscriptDocument,
//   TranscriptParser,
//   TranscriptSegment,
// } from "../../types";

// import { timestampToSeconds } from "../../utils";

// export class VttParser implements TranscriptParser {
//   parse(
//     content: string,
//     options: ParseOptions
//   ): TranscriptDocument {

//     const segments: TranscriptSegment[] = [];

//     // Remove WEBVTT header
//     content = content.replace(/^WEBVTT\s*/i, "").trim();

//     const blocks = content.split(/\r?\n\r?\n/);

//     let id = 1;

//     for (const block of blocks) {

//       const lines = block
//         .split(/\r?\n/)
//         .filter(Boolean);

//       if (lines.length < 2) continue;

//       const [start, end] = lines[0]
//         .split("-->")
//         .map(t => t.trim());

//       const text = lines
//         .slice(1)
//         .join(" ");

//       segments.push({
//         id: id++,
//         start: timestampToSeconds(start),
//         end: timestampToSeconds(end),
//         text,
//       });

//     }

//     return {
//       lesson: options.lesson,
//       language: options.language,
//       segments,
//     };

//   }
// }

// src/parsers/VttParser.ts

import { TranscriptSegment } from "../types";

import { BaseSubtitleParser } from "./BaseSubtitleParser";

export class VttParser extends BaseSubtitleParser {

  protected preprocess(content: string): string {

    return content
      .replace(/^WEBVTT\s*/i, "")
      .trim();

  }

  protected parseBlock(
    block: string,
    id: number
  ): TranscriptSegment | null {

    const lines = block
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 2)
      return null;

    const [start, end] =
      lines[0]
        .split("-->")
        .map(t => t.trim());

    const text =
      lines
        .slice(1)
        .join(" ");

    return this.createSegment(
      id,
      start,
      end,
      text
    );

  }

}