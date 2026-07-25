import { SemanticSearcher } from "../retrieval";
import { OpenAIEmbeddingService } from "../embeddings/OpenAIEmbeddingService";
import { qdrant } from "../vectorstore/QdrantClient";
import { QdrantVectorStore } from "../vectorstore";

export async function testSearch() {
  console.log("\n========== TEST 5: Semantic Search ==========");
 
const embeddingService =
    new OpenAIEmbeddingService();

const vectorStore =
    new QdrantVectorStore();

const searcher =
    new SemanticSearcher(
        embeddingService,
        vectorStore
    );
  const results = await searcher.search(
    "What are the types of mobile apps?"
  );

  console.log(`✅ Found ${results.length} results`);
  console.log("\nResults:");
  
  for (const result of results.slice(0, 3)) {
    console.log(`\n   Score: ${result.score.toFixed(3)}`);
    console.log(`   Lesson: ${result.chunk.metadata.lessonTitle}`);
    console.log(`   Time: ${result.chunk.start} - ${result.chunk.end}`);
    console.log(`   Text: ${result.chunk.text.slice(0, 100)}...`);
  }
  console.log("====================================\n");
  
  return results;

//   const searcher = new SemanticSearcher();

// const results = await searcher.search(
//     "What are the types of mobile apps?"
// );


// console.log("\n========================");

// console.log("SEARCH RESULTS");

// console.log("========================");

// for (const result of results) {

//     console.log(
//         `Score: ${result.score.toFixed(3)}`
//     );

//     console.log(
//         `Lesson: ${result.chunk.metadata.lessonTitle}`
//     );

//     console.log(
//         `${result.chunk.start} - ${result.chunk.end}`
//     );

//     console.log(result.chunk.text);

//     console.log("------------------------");
//   }
}