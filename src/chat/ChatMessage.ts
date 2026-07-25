// src/chat/ChatMessage.ts
export interface ChatMessage {

    role:
        | "system"
        | "user"
        | "assistant";

    content: string;

}