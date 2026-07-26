// src/vectorstore/QdrantVectorStore.ts
import { qdrant } from "./QdrantClient";
import { VectorDocument } from "./VectorDocument";
import { QdrantPayloadMapper } from "./QdrantPayloadMapper";
import { SearchOptions } from './SearchOptions'
import { VectorSearchResult } from './VectorSearchResult'
import { DocumentChunk } from "../types";
import { VectorStore } from "./VectorStore";
import { SearchFilter } from "../retrieval";
import { timeStamp } from "node:console";

import { QdrantClient } from '@qdrant/js-client-rest';

const COLLECTION_NAME = "notebook-Lm-col";

export class QdrantVectorStore implements VectorStore {
    private client = new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY })

//   private readonly client = qdrant;

    constructor(
        private readonly collectionName = COLLECTION_NAME
    ) {}

//     private buildFilter(filter?: SearchFilter) {
//         console.dir(filter, { depth: null });

//     if (!filter) {
//         return undefined;
//     }

//     const must: any[] = [];

//     if (filter.courseId) {
//         must.push({
//             key: "metadata.courseId",
//             match: {
//                 value: filter.courseId,
//             },
//         });
//     }

//     // Support filtering by multiple course IDs
//         if (filter.courseId && filter.courseId.length > 0) {
//             must.push({
//                 key: "metadata.courseId",
//                 match: { any: filter.courseId },
//             });
//         }

//     if (filter.lessonId) {
//         must.push({
//             key: "metadata.lessonId",
//             match: {
//                 value: filter.lessonId,
//             },
//         });
//     }

    

//     return must.length ? { must } : undefined;
// }

    private buildFilter(filter?: SearchFilter) {
        if (!filter) return undefined;

        const must: any[] = [];

        // Single course filter
        if (filter.courseId) {
            must.push({
                key: "metadata.courseId",
                match: { value: filter.courseId },
            });
        }

        // Multiple courses filter (only if courseId not already set)
        if (filter.courseIds && filter.courseIds.length > 0) {
            must.push({
                key: "metadata.courseId",
                match: { any: filter.courseIds },
            });
        }

        if (filter.lessonId) {
            must.push({
                key: "metadata.lessonId",
                match: { value: filter.lessonId },
            });
        }

        return must.length ? { must } : undefined;
    }

    async upsert(vector: VectorDocument): Promise<void> {
    await this.upsertBatch([vector]);
}

    async upsertBatch(
    vectors: VectorDocument[]
): Promise<void> {

    if (vectors.length === 0) {
        return;
    }

    const points = vectors.map(vector => ({
        id: vector.chunk.id,
        vector: vector.embedding,
        payload: QdrantPayloadMapper.toPayload(vector.chunk),
    }));

    console.log(`📦 Batch inserting ${points.length} vectors...`);

    await this.client.upsert(this.collectionName, {
        wait: true,
        points,
    });

    console.log(`✅ Batch insert completed`);
}

  async createCollection() {

    const collections = await this.client.getCollections();

    const exists = collections.collections.some(
      c => c.name === this.collectionName
    );

    if (exists) {
      console.log("Collection already exists.");
      return;
    }

    await this.client.createCollection(this.collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    console.log("Collection created.");
  }

  async recreateCollection(): Promise<void> {

    const collections =
        await this.client.getCollections();

    const exists =
        collections.collections.some(
            c => c.name === this.collectionName
        );

    if (exists) {

        console.log("🗑️ Deleting existing collection...");

        await this.client.deleteCollection(
            this.collectionName
        );

    }

    console.log("📦 Creating collection...");

    await this.createCollection();

}
 

  async search(
    embedding: number[],
    options?: SearchOptions,
    filter?: SearchFilter
  ): Promise<VectorSearchResult[]> {

    const qdrantFilter = this.buildFilter(filter);
    
    // Build query params — ONLY add filter if it exists
    const queryParams: any = {
      query: embedding,
      limit: options?.limit ?? 5,
      with_payload: true,
    };
    
    if (qdrantFilter) {
      queryParams.filter = qdrantFilter;
    }

    console.log('🔍 Qdrant search params:', {
      collection: this.collectionName,
      limit: queryParams.limit,
      filter: qdrantFilter,
      vectorSample: embedding.slice(0, 3),
    });

    const response = await this.client.query(this.collectionName, queryParams);

    console.log('🔍 Qdrant response:', {
      pointsCount: response.points?.length ?? 0,
      scores: response.points?.map((p: any) => p.score),
      sources: response.points?.map((p: any) => p.payload?.metadata?.lessonTitle),
    });

    if (!response.points || response.points.length === 0) {
      console.warn('⚠️ Qdrant returned 0 results');
      return [];
    }

    return response.points.map((point: any) => ({
      score: point.score,
      chunk: point.payload as DocumentChunk,
    }));
  }


//   async search(
//     embedding: number[],
//     options?: SearchOptions,
//     filter?: SearchFilter
// ): Promise<VectorSearchResult[]> {

//     const qdrantFilter = this.buildFilter(filter);

// // console.dir(qdrantFilter, { depth: null });

//     const response = await this.client.query(
//     this.collectionName,
//     {
//         query: embedding,
//         limit: options?.limit ?? 5,
//         with_payload: true,
//         filter: this.buildFilter(filter),
//     }
// );

// // console.dir(response.points[0].payload, {
// //     depth: null,
// // });
//     return response.points.map((point: any) => ({
//         score: point.score,
//         chunk: point.payload as DocumentChunk,
//     }));

// }

    async deleteByCourseId(courseId: string): Promise<void> {
    try {
      await this.client.delete(this.collectionName, {
        wait: true,
        filter: {
          must: [{
            key: "metadata.courseId",
            match: { value: courseId },
          }],
        },
      });
      console.log(`🗑️ Deleted vectors for course: ${courseId}`);
    } catch (err: any) {
      console.error("🗑️ Qdrant delete failed:", err.message);
      // Don't throw — we still want to clean up files/DB even if Qdrant misses some vectors
    }
  }

async debugPayload() {

    const response = await this.client.scroll(
        this.collectionName,
        {
            limit: 1,
            with_payload: true,
            with_vector: false,
        }
    );

    console.dir(response.points[0], {
        depth: null,
    });

}
}   