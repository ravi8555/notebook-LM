// // src/services/RAGService.ts
// import { SemanticSearcher } from "../retrieval";
// import { PromptBuilder } from "../prompts";
// import { ChatService } from "../chat";
// import { AIResponse } from "../chat";

// export class RAGService {
//   constructor(
//     private readonly searcher: SemanticSearcher,
//     private readonly chatService: ChatService
//   ) {}

//   async ask(question: string, filter?: any): Promise<AIResponse> {
//     const results = await this.searcher.search(question, filter, 10);
//     const promptBuilder = new PromptBuilder();
//     const prompt = promptBuilder.build(question, results);
    
//     const response = await this.chatService.generate([
//       { role: "user", content: prompt },
//     ]);

//     const relevantSources = results
//       .filter((r) => r.score > 0.15)
//       .sort((a, b) => b.score - a.score)
//       .filter((r, index, self) => 
//         index === self.findIndex((t) => t.chunk.lessonId === r.chunk.lessonId)
//       )
//       .slice(0, 4);

//     return {
//       ...response,
//       sources: relevantSources.map((r) => ({
//         lesson: r.chunk.metadata.lessonTitle,
//         lessonId: r.chunk.lessonId,
//         start: r.chunk.start,
//         end: r.chunk.end,
//       })),
//     };
//   }

//   // NEW: Stream the LLM response, return sources separately
//   async *askStream(question: string, filter?: any): AsyncGenerator<
//     { type: 'sources'; sources: any[] } | { type: 'delta'; content: string },
//     void,
//     unknown
//   > {
//     const results = await this.searcher.search(question, filter, 10);
//     const promptBuilder = new PromptBuilder();
//     const prompt = promptBuilder.build(question, results);

//     // 1. Yield sources first so frontend can show chips immediately
//     const relevantSources = results
//       .filter((r) => r.score > 0.15)
//       .sort((a, b) => b.score - a.score)
//       .filter((r, index, self) => 
//         index === self.findIndex((t) => t.chunk.lessonId === r.chunk.lessonId)
//       )
//       .slice(0, 4)
//       .map((r) => ({
//         lesson: r.chunk.metadata.lessonTitle,
//         lessonId: r.chunk.lessonId,
//         start: r.chunk.start,
//         end: r.chunk.end,
//       }));

//     yield { type: 'sources', sources: relevantSources };

//     // 2. Stream LLM tokens
//     for await (const delta of this.chatService.generateStream([
//       { role: "user", content: prompt },
//     ])) {
//       yield { type: 'delta', content: delta };
//     }
//   }
// }

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
    const promptBuilder = new PromptBuilder();
    const prompt = promptBuilder.build(question, results);

    const response = await this.chatService.generate([
      { role: "user", content: prompt },
    ]);

    // Return ALL relevant chunks — no deduplication. Each chip is exact.
    const relevantSources = results
      .filter((r) => r.score > 0.01)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => ({
        lesson: r.chunk.metadata.lessonTitle,
        lessonId: r.chunk.lessonId,
        start: r.chunk.start,
        end: r.chunk.end,
      }));

    return {
      ...response,
      sources: relevantSources,
    };
  }

  async *askStream(question: string, filter?: any): AsyncGenerator<
    { type: 'sources'; sources: any[] } | { type: 'delta'; content: string },
    void,
    unknown
  > {
    const results = await this.searcher.search(question, filter, 10);
    const promptBuilder = new PromptBuilder();
    const prompt = promptBuilder.build(question, results);

    const relevantSources = results
      .filter((r) => r.score > 0.01)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => ({
        lesson: r.chunk.metadata.lessonTitle,
        lessonId: r.chunk.lessonId,
        start: r.chunk.start,
        end: r.chunk.end,
      }));

    yield { type: 'sources', sources: relevantSources };

    for await (const delta of this.chatService.generateStream([
      { role: "user", content: prompt },
    ])) {
      yield { type: 'delta', content: delta };
    }
  }
}