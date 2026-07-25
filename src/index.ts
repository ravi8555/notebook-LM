import fs from "fs/promises";
import { SrtParser, VttParser } from "./parsers";
import { TranscriptCleaner } from "./cleaner";
import { SemanticChunker } from "./chunking";
import { OpenAIEmbeddingService,EmbeddingService } from './embeddings';
import { QdrantVectorStore,VectorStore } from "./vectorstore";
import { SemanticSearcher } from './retrieval';
import { IndexingService } from "./services/IndexingService";

// Import all tests
import { testParser } from "./tests/test-1-parser";
import { testParserComparison } from "./tests/test-2-parser-comparison";
import { testChunker } from "./tests/test-3-chunker";
import { testEmbeddings } from "./tests/test-4-embeddings";
import { testSearch } from "./tests/test-5-search";
import { testIndexing } from "./tests/test-6-indexing";
import {testPromptBuilder} from "./tests/test-7-prompt" 
import { testRAG } from "./tests/test-8-rag"; 
import { testCourseLoader } from "./tests/test-9-course-loader";
import { testTranscriptProcessor } from "./tests/test-10-transcript-processor";
import { testBatchCourseIndex } from "./tests/test-11-course-indexer";
import { testFilter } from "./tests/test-13-filter";

// async function main() {
//   console.log("🚀 Starting Course RAG AI Tests\n");
//   console.log("=".repeat(50));

//   try {
//     // Run all tests
//     await testParser();
//     await testParserComparison();
//     await testChunker();
//     await testEmbeddings();
//     await testSearch();

//     console.log("\n✅ All tests completed successfully!");
//     console.log("=".repeat(50));
//   } catch (error) {
//     console.error("\n❌ Error during tests:", error);
//     process.exit(1);
//   }
// }

// Optional: Run specific tests by commenting/uncommenting
async function runSpecificTests() {
  // Run only specific tests
  // await testParser();
  // await testChunker();
  // await testSearch();
  // await testEmbeddings();
  // await testPromptBuilder();
  
  // await testIndexing()
  // await testRAG()

  // await testCourseLoader()
  
  // await testTranscriptProcessor()
  // await testCourseIndexer()
  // await testBatchCourseIndex()

  

  await testFilter()
}

// Choose which function to run
// main();
runSpecificTests();