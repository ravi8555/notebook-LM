// src/services/RAGService.ts

import { SemanticSearcher } from "../retrieval";
import { PromptBuilder } from "../prompts";
import { ChatService } from "../chat";
import { AIResponse } from "../chat";

export class RAGService {
  constructor(
    private readonly searcher: SemanticSearcher,
    private readonly chatService: ChatService
  ) {}

  

  async ask(question: string): Promise<AIResponse> {
    const results = await this.searcher.search(question);

    const promptBuilder = new PromptBuilder();
    const prompt = promptBuilder.build(
    question,
    results
);

    // const prompt = promptBuilder.build(
    //   question,
    //   results.map((r) => r.chunk)
    // );

    const response = await this.chatService.generate([
    {
        role: "user",
        content: prompt,
    },
]);

    return {
      ...response,
     sources: results.map((r) => ({
    lesson: r.chunk.metadata.lessonTitle,
    lessonId: r.chunk.lessonId,
    start: r.chunk.start,
    end: r.chunk.end,
}))
    }
  }
}