// // src/embeddings/OpenAIEmbeddingService.ts



// import { openai, EMBEDDING_MODEL } from "../config/openai";
// import { EmbeddingService } from "./EmbeddingService";

// export class OpenAIEmbeddingService implements EmbeddingService {

//   async embed(text: string): Promise<number[]> {

//     const response = await openai.embeddings.create({
//       model: EMBEDDING_MODEL,
//       input: text,
//     });

//     return response.data[0].embedding;
//   }

//   async embedBatch(texts: string[]): Promise<number[][]> {

//     const response = await openai.embeddings.create({
//       model: EMBEDDING_MODEL,
//       input: texts,
//     });

//     return response.data.map(item => item.embedding);
//   }
// }


import { openai, EMBEDDING_MODEL } from "../config/openai";
import { EmbeddingService } from "./EmbeddingService";

export class OpenAIEmbeddingService implements EmbeddingService {

    async embed(text: string): Promise<number[]> {

        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });

        return response.data[0].embedding;
    }

    async embedBatch(texts: string[]): Promise<number[][]> {

        console.log(`🚀 Embedding ${texts.length} chunks in ONE request`);

        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: texts,
        });

        return response.data.map(item => item.embedding);
    }
}