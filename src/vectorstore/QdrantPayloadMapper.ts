// // src/vectorstore/QdrantPayloadMapper.ts
// import { DocumentChunk } from "../types";

// export class QdrantPayloadMapper {
//   static toPayload(chunk: DocumentChunk): Record<string, unknown> {
//     return {
//       id: chunk.id,
//       documentId: chunk.documentId,
//       lessonId: chunk.lessonId,

//       start: chunk.start,
//       end: chunk.end,

//       text: chunk.text,

//       metadata: {
//         lessonTitle: chunk.metadata.lessonTitle,
//         source: chunk.metadata.source,
//         segmentIds: chunk.metadata.segmentIds,
//         tokenCount: chunk.metadata.tokenCount,
//         duration: chunk.metadata.duration,
//       },
//     };
//   }
// }

// src/vectorstore/QdrantPayloadMapper.ts

import { DocumentChunk } from "../types";

export class QdrantPayloadMapper {

    static toPayload(chunk: DocumentChunk): Record<string, unknown> {

        return {

            id: chunk.id,

            documentId: chunk.documentId,

            lessonId: chunk.lessonId,

            start: chunk.start,

            end: chunk.end,

            text: chunk.text,

            metadata: {

                courseId: chunk.metadata.courseId,

                courseTitle: chunk.metadata.courseTitle,

                lessonId: chunk.metadata.lessonId,

                lessonTitle: chunk.metadata.lessonTitle,

                lessonOrder: chunk.metadata.lessonOrder,

                source: chunk.metadata.source,

                segmentIds: chunk.metadata.segmentIds,

                tokenCount: chunk.metadata.tokenCount,

                duration: chunk.metadata.duration,

            }

        };

    }

}