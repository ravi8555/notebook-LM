import fs from "fs/promises";
import { SrtParser } from "../parsers";
import { TranscriptCleaner } from "../cleaner";
import { SemanticChunker } from "../chunking";
import { OpenAIEmbeddingService } from "../embeddings";
import { QdrantVectorStore } from "../vectorstore";

export async function testEmbeddings() {
  console.log("\n========== TEST 4: Embeddings & Vector Store ==========");
  
  // Parse and chunk
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

  // Test embedding
  const embeddingService = new OpenAIEmbeddingService();
  const embedding = await embeddingService.embed(chunks[0].text);
  
  console.log(`✅ Embedding Dimension: ${embedding.length}`);
  console.log(`   First 10 values: [${embedding.slice(0, 10).join(', ')}...]`);

  // Store in vector DB
  const vectorStore = new QdrantVectorStore();
  // await vectorStore.createCollection();
  await vectorStore.recreateCollection();
  
  
  let upserted = 0;
  // for (const chunk of chunks.slice(0, 3)) { // Only first 3 for test
  for (const chunk of chunks) { // Only first 3 for test
    const embedding = await embeddingService.embed(chunk.text);
    await vectorStore.upsert({ chunk, embedding });
    upserted++;
  }
  const texts = chunks.map(chunk => chunk.text);
  
  console.log(`✅ Upserted ${upserted} chunks to vector store`);
  console.log("====================================\n");
  
  return { chunks, embeddingService };
}