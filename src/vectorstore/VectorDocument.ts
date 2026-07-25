// src/vectorstore/VectorDocument.ts

import { DocumentChunk } from "../types";

export interface VectorDocument {
  chunk: DocumentChunk;

  embedding: number[];
}