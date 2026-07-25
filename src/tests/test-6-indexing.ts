
import { OpenAIEmbeddingService,EmbeddingService } from '../embeddings';
import { QdrantVectorStore } from "../vectorstore";
import fs from "fs/promises";
import { SrtParser } from "../parsers";
import { TranscriptCleaner } from "../cleaner";
import { SemanticChunker } from "../chunking";

import { IndexingService } from "../services/IndexingService";


export async function testIndexing() {
    const content = await fs.readFile(
        "./data/01_what-is-mobile-development_epm.srt",
        "utf8"
      );
      const parser = new SrtParser();
  const transcript = parser.parse(content, {
    lesson: {
      id: "lesson-001",
      title: "01 What is Mobile Development",
      order: 1,
      source: "srt",
    },
  });

  const cleaner = new TranscriptCleaner();
  const cleanedTranscript = cleaner.clean(transcript);
  const chunker = new SemanticChunker();
  const chunks = chunker.chunk(cleanedTranscript);

    const embeddingService = new OpenAIEmbeddingService();
    const vectorStore = new QdrantVectorStore();
    
    const indexingService = new IndexingService(
    embeddingService,
    vectorStore
);
await indexingService.rebuild(chunks);
// await indexingService.index(chunks);
}
