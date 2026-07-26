// // src/services/RAGService.ts
import { SemanticSearcher } from "../retrieval";
import { PromptBuilder } from "../prompts";
import { ChatService } from "../chat";
import { AIResponse } from "../chat";

export class RAGService {
  constructor(
    private readonly searcher: SemanticSearcher,
    private readonly chatService: ChatService
  ) {}

  async ask(question: string, filter?: any): Promise<AIResponse> {
    const results = await this.searcher.search(question, filter, 10);

    console.log('📚 RAG retrieved:', results.length, 'chunks');

    // Build prompt with all chunks (LLM needs full context)
    const promptBuilder = new PromptBuilder();
    const prompt = promptBuilder.build(question, results);

    const response = await this.chatService.generate([
      { role: "user", content: prompt },
    ]);

    // Filter sources: only show relevant ones
    // 1. Sort by score (highest first)
    // 2. Remove duplicates by lessonId
    // 3. Only keep top 4 most relevant
    const relevantSources = results
      .filter((r) => r.score > 0.2) // remove noise (tune this threshold)
      .sort((a, b) => b.score - a.score)
      .filter((r, index, self) => 
        index === self.findIndex((t) => t.chunk.lessonId === r.chunk.lessonId)
      )
      .slice(0, 4); // max 4 unique sources

    return {
      ...response,
      sources: relevantSources.map((r) => ({
        lesson: r.chunk.metadata.lessonTitle,
        lessonId: r.chunk.lessonId,
        start: r.chunk.start,
        end: r.chunk.end,
      })),
    };
  }
}
// import { SemanticSearcher } from "../retrieval";
// import { PromptBuilder } from "../prompts";
// import { ChatService } from "../chat";
// import { AIResponse } from "../chat";
// import { SearchFilter } from "../retrieval/SearchFilter";

// export class RAGService {
//   constructor(
//     private readonly searcher: SemanticSearcher,
//     private readonly chatService: ChatService
//   ) {}

//   async ask(question: string, filter?: SearchFilter): Promise<AIResponse> {
//     const results = await this.searcher.search(question, filter);

//     const promptBuilder = new PromptBuilder();
//     const prompt = promptBuilder.build(question, results);

//     const response = await this.chatService.generate([
//       { role: "user", content: prompt },
//     ]);

//     return {
//       ...response,
//       sources: results.map((r) => ({
//         lesson: r.chunk.metadata.lessonTitle,
//         lessonId: r.chunk.lessonId,
//         start: r.chunk.start,
//         end: r.chunk.end,
//       })),
//     };
//   }
// }