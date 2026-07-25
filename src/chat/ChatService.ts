// src/chat/ChatService.ts

import { ChatMessage } from "./ChatMessage";
import { AIResponse } from "./AIResponse";

export interface ChatService {

    generate(
        messages: ChatMessage[]
    ): Promise<AIResponse>;

}