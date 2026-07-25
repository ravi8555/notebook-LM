import { PromptBuilder } from "../prompts";
import { OpenAIEmbeddingService } from "../embeddings";
import { QdrantVectorStore } from "../vectorstore";
import { SemanticSearcher } from "../retrieval";
import { log } from "console";

export async function testPromptBuilder() {

    console.log("\n========== TEST 7: Prompt Builder ==========\n");

    const embeddingService = new OpenAIEmbeddingService();
    const vectorStore = new QdrantVectorStore();

    const searcher = new SemanticSearcher(
        embeddingService,
        vectorStore
    );

    const results = await searcher.search(
        "What are the types of mobile apps?"
    );

    const builder = new PromptBuilder();

    const prompt = builder.build(
        "What are the types of mobile apps?",
        results
    );

    console.log(prompt);

results.forEach((result, index) => {
    console.log("Result ====>")
    console.log(index);

    console.log(result.chunk.id);

    console.log(result.chunk.start);

    console.log(result.score);

});

    console.log("\n============================================\n");

}