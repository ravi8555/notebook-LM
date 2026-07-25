import { DocumentChunk } from "../types";
import { EmbeddingService } from "../embeddings";
import { VectorStore, VectorDocument } from "../vectorstore";

export class IndexingService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStore: VectorStore
  ) {}

  async rebuild(chunks: DocumentChunk[]) {

        await this.vectorStore.recreateCollection();

        await this.index(chunks);

    }

  async index(chunks: DocumentChunk[]) {

    const texts = chunks.map(chunk => chunk.text);

    const embeddings =
        await this.embeddingService.embedBatch(texts);

    if (chunks.length !== embeddings.length) {
        throw new Error("Chunks and embeddings count mismatch.");
    }

    const vectors: VectorDocument[] =
        chunks.map((chunk, index) => ({
            chunk,
            embedding: embeddings[index],
        }));

    await this.vectorStore.upsertBatch(vectors);
}

//   async index(chunks: DocumentChunk[]): Promise<void> {
//     const texts = chunks.map(chunk => chunk.text);

//     const embeddings =
//       await this.embeddingService.embedBatch(texts);

//     if (chunks.length !== embeddings.length) {
//       throw new Error(
//         "Chunks and embeddings count mismatch."
//       );
//     }

//     const vectors = chunks.map((chunk, index) => ({
//       chunk,
//       embedding: embeddings[index],
//     }));
    
// await this.vectorStore.upsertBatch(vectors);
//     for (const vector of vectors) {
//       await this.vectorStore.upsert(vector);
//     }
//   }
}