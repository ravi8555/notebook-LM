import { VectorDocument } from "./VectorDocument";
import { VectorSearchResult } from "./VectorSearchResult";
import { SearchOptions } from "./SearchOptions";
import { SearchFilter } from "../retrieval/SearchFilter";

export interface VectorStore {
  createCollection(): Promise<void>;

  recreateCollection(): Promise<void>;


  upsert(vector: VectorDocument): Promise<void>;
  upsertBatch(vectors: VectorDocument[]): Promise<void>;

  search(
    embedding: number[],
    options?: SearchOptions,
    filter?: SearchFilter
  ): Promise<VectorSearchResult[]>;
}