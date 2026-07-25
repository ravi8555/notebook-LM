// src/chat/OpenAIChatService.ts

import OpenAI from "openai";

import { ChatService } from "./ChatService";
import { ChatMessage } from "./ChatMessage";
import { AIResponse } from "./AIResponse";

import { OPENAI_API_KEY } from "../config";

export class OpenAIChatService
implements ChatService {

    private readonly client =
        new OpenAI({
            apiKey: OPENAI_API_KEY,
        });

    async generate(
  messages: ChatMessage[]
): Promise<AIResponse> {

  const response = await this.client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages,
  });

  return {
    answer: response.choices[0]?.message.content ?? "",
    sources: [],
  };
}

}