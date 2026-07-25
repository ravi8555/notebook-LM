import { SemanticSearcher } from "../retrieval";
import { OpenAIEmbeddingService } from "../embeddings"; 
import { QdrantVectorStore } from "../vectorstore";


const embeddingService = new OpenAIEmbeddingService();
    const vectorStore = new QdrantVectorStore();
export async function testFilter() {

    const store = new QdrantVectorStore();

await store.debugPayload();


    
    const searcher =
    new SemanticSearcher(
        embeddingService,
        vectorStore
    );

    const results = await searcher.search(
    "What is Expo?",
    {
        courseId: "react-native",
    },
    5
);
    
//     const results = await searcher.search(
//         "What is Expo?",
//         {
//             lessonId: "lesson-002",
//         },
//     5
// );

console.log(results.length);
console.table(results);

console.table(
    results.map(r => ({
        lesson: r.chunk.metadata.lessonTitle,
        course: r.chunk.metadata.courseTitle,
        score: r.score,
    }))
);
}    