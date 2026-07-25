import { DocumentChunk } from "../types";

export interface VectorSearchResult {
  score: number;
  chunk: DocumentChunk;
}