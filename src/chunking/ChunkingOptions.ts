// src/chunking/ChunkingOptions.ts

// export interface ChunkingOptions {

//   maxDuration?: number;

//   maxTokens?: number;

//   pauseThreshold?: number;

// }

export interface ChunkingOptions {
  maxDuration: number;

  maxTokens: number;

  pauseThreshold: number;
}

export const DEFAULT_CHUNK_OPTIONS: ChunkingOptions = {
  maxDuration: 45,

  maxTokens: 300,

  pauseThreshold: 3,
};