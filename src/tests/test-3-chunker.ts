import fs from "fs/promises";
import { SrtParser } from "../parsers";
import { TranscriptCleaner } from "../cleaner";
import { SemanticChunker } from "../chunking";

export async function testChunker() {
  console.log("\n========== TEST 3: Semantic Chunker ==========");
  
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

  console.log(`✅ Created ${chunks.length} chunks`);
  
  console.table(
    chunks.slice(0, 5).map((chunk) => ({
      id: chunk.id,
      start: chunk.start,
      end: chunk.end,
      duration: chunk.metadata.duration,
      tokens: chunk.metadata.tokenCount,
      segments: chunk.metadata.segmentIds.length,
    }))
  );
  console.log("====================================\n");
  
  return chunks;
}