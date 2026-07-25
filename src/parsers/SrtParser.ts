// // src/parsers/SrtParser.ts

// import {
//     ParseOptions,
//     TranscriptDocument,
//     TranscriptParser,
//     TranscriptSegment,
//     Lesson
// }from '../../types'

// import { timestampToSeconds } from '../../utils'

// export class SrtParser implements TranscriptParser{
//     parse(content: string, options: ParseOptions): TranscriptDocument {
//         const segments: TranscriptSegment[] =[];
//         const blocks = content
//       .trim()
//       .split(/\r?\n\r?\n/);

//     for (const block of blocks) {
//       const lines = block.split(/\r?\n/);

//       if (lines.length < 3) continue;

//       const id = Number(lines[0]);

//       const [start, end] = lines[1]
//         .split("-->")
//         .map((t) => t.trim());

//       const text = lines
//         .slice(2)
//         .join(" ");

//       segments.push({
//         id,
//         start: timestampToSeconds(start),
//         end: timestampToSeconds(end),
//         text,
//       });
//     }

// return {
//   lesson: options.lesson,
//   language: options.language,
//   segments,
// };

//   }
// }


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