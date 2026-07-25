import { OpenAIEmbeddingService } from "../embeddings";
import { QdrantVectorStore } from "../vectorstore";
import { SemanticSearcher } from "../retrieval";
import { OpenAIChatService } from "../chat";
import { RAGService } from "../services";

export async function testRAG() {

    console.log("\n========== TEST 8 ==========\n");

    const embedding = new OpenAIEmbeddingService();

    const vectorStore = new QdrantVectorStore();

    const searcher = new SemanticSearcher(
        embedding,
        vectorStore
    );

    const chat = new OpenAIChatService();

    const rag = new RAGService(
        searcher,
        chat
    );

    const response =
        await rag.ask(
            "What are the types of mobile apps?"
        );

    console.log(response.answer);

    console.table(response.sources);

}