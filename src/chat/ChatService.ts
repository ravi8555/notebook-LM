// src/chat/ChatService.ts

import { ChatMessage } from "./ChatMessage";
import { AIResponse } from "./AIResponse";

export interface ChatService {
  generate(messages: ChatMessage[]): Promise<AIResponse>;
  
  // NEW: Streaming generator
  generateStream(
    messages: ChatMessage[]
  ): AsyncGenerator<string, void, unknown>;
}