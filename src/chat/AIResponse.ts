// src/chat/AIResponse.ts
export interface AISource {

    lesson: string;

    lessonId: string;

    start: number;

    end: number;

}

export interface AIResponse {

    answer: string;

    sources: AISource[];

}