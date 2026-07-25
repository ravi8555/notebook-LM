// import { DocumentChunk } from "../types";

// export class SemanticChunker {

//     chunk(document:DocumentChunk):DocumentChunk[]{

//     }

// }

// src/chunking/SemanticChunker.ts

import {
  DocumentChunk,
  TranscriptDocument,
  TranscriptSegment,
} from "../types";

import {
  ChunkingOptions,
  DEFAULT_CHUNK_OPTIONS,
} from "./ChunkingOptions";
import { v4 as uuid } from "uuid";
export class SemanticChunker {

    constructor(
        private readonly options: ChunkingOptions = DEFAULT_CHUNK_OPTIONS
    ) {}

    // private shouldCreateChunk(
    //     currentSegments: TranscriptSegment[],
    //     nextSegment: TranscriptSegment
    // ): boolean {

    //     // we'll implement this next
    //     return false;

    // } 


    private shouldCreateChunk(
    currentSegments: TranscriptSegment[],
    nextSegment: TranscriptSegment
): boolean {

    const currentStart = currentSegments[0].start;

    const duration = nextSegment.end - currentStart;

    if (duration > this.options.maxDuration) {
        return true;
    }

    const currentText = currentSegments
        .map(s => s.text)
        .join(" ");

    const estimatedTokens =
        this.estimateTokens(
            currentText + " " + nextSegment.text
        );

    if (estimatedTokens > this.options.maxTokens) {
        return true;
    }

    const previous =
        currentSegments[currentSegments.length - 1];

    const pause =
        nextSegment.start - previous.end;

    if (pause > this.options.pauseThreshold) {
        return true;
    }

    return false;

}


    private estimateTokens(text: string): number {

        return Math.ceil(
            text.split(/\s+/).length * 1.3
        );

    }

    private buildChunk(
        document: TranscriptDocument,
        segments: TranscriptSegment[],
        index: number
    ): DocumentChunk {

        const text = segments
            .map(s => s.text)
            .join(" ");

        return {
            id: uuid(),

            documentId: document.lesson.id,

            lessonId: document.lesson.id,

            start: segments[0].start,

            end: segments.at(-1)!.end,

            text,

            metadata: {
                lessonTitle: document.lesson.title,

                source: document.lesson.source,

                segmentIds: segments.map(s => s.id),

                tokenCount: this.estimateTokens(text),

                duration:
                    segments.at(-1)!.end -
                    segments[0].start,
            },
        };

    }

    chunk(document: TranscriptDocument): DocumentChunk[] {

        const chunks: DocumentChunk[] = [];

        let current: TranscriptSegment[] = [];

        let index = 1;

        for (const segment of document.segments) {

            if (
                current.length &&
                this.shouldCreateChunk(current, segment)
            ) {

                chunks.push(
                    this.buildChunk(
                        document,
                        current,
                        index++
                    )
                );

                current = [];

            }

            current.push(segment);

        }

        if (current.length) {

            chunks.push(
                this.buildChunk(
                    document,
                    current,
                    index
                )
            );

        }

        return chunks;

    }

}