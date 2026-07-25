// src/embeddings/EmbeddingService.ts
export interface EmbeddingService {
  embed(text: string): Promise<number[]>;

  embedBatch(texts: string[]): Promise<number[][]>;
}

