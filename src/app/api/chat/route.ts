// // src/app/api/chat/route.ts
// import { NextRequest } from 'next/server';
// import { RAGService } from '@/services/RAGService';
// import { SemanticSearcher } from '@/retrieval/SemanticSearcher';
// import { OpenAIChatService } from '@/chat/OpenAIChatService';
// import { OpenAIEmbeddingService } from '@/embeddings/OpenAIEmbeddingService';
// import { QdrantVectorStore } from '@/vectorstore';
// import { SearchFilter } from '@/retrieval/SearchFilter';

// const vectorStore = new QdrantVectorStore();
// const embeddingService = new OpenAIEmbeddingService();
// const searcher = new SemanticSearcher(embeddingService, vectorStore);
// const chatService = new OpenAIChatService();
// const rag = new RAGService(searcher, chatService);

// export async function POST(req: NextRequest) {
//   const { question, sourceIds } = await req.json();

//   let filter: SearchFilter | undefined;
//   if (sourceIds && sourceIds.length > 0) {
//     filter = { courseIds: sourceIds };
//   }

//   const generator = rag.askStream(question, filter);

//   // Pull the first chunk to extract sources before we send headers
//   const first = await generator.next();
//   let sources: any[] = [];

//   if (!first.done && first.value.type === 'sources') {
//     sources = first.value.sources;
//   }

//   const stream = new ReadableStream({
//     async start(controller) {
//       const encoder = new TextEncoder();

//       // Edge case: if the first yield was somehow a delta, enqueue it
//       if (!first.done && first.value.type === 'delta') {
//         controller.enqueue(encoder.encode(first.value.content));
//       }

//       try {
//         for await (const chunk of generator) {
//           if (chunk.type === 'delta' && chunk.content) {
//             controller.enqueue(encoder.encode(chunk.content));
//           }
//         }
//       } catch (err) {
//         console.error('Streaming error:', err);
//         controller.error(err);
//       } finally {
//         controller.close();
//       }
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/plain; charset=utf-8',
//       'x-sources': JSON.stringify(sources),
//     },
//   });
// }


import { NextRequest } from 'next/server';
import { RAGService } from '@/services/RAGService';
import { SemanticSearcher } from '@/retrieval/SemanticSearcher';
import { OpenAIChatService } from '@/chat/OpenAIChatService';
import { OpenAIEmbeddingService } from '@/embeddings/OpenAIEmbeddingService';
import { QdrantVectorStore } from '@/vectorstore';
import { SearchFilter } from '@/retrieval/SearchFilter';

const vectorStore = new QdrantVectorStore();
const embeddingService = new OpenAIEmbeddingService();
const searcher = new SemanticSearcher(embeddingService, vectorStore);
const chatService = new OpenAIChatService();
const rag = new RAGService(searcher, chatService);

export async function POST(req: NextRequest) {
  const { question, sourceIds } = await req.json();

  let filter: SearchFilter | undefined;
  if (sourceIds && sourceIds.length > 0) {
    filter = { courseIds: sourceIds };
  }

  // Use streaming RAG
  const generator = rag.askStream(question, filter);

  // Pull the first yield to extract sources before sending headers
  const first = await generator.next();
  let sources: any[] = [];

  if (!first.done && first.value.type === 'sources') {
    sources = first.value.sources;
    console.log('📎 Sources for header:', sources.length, sources.map((s) => s.lesson));
  } else if (!first.done && first.value.type === 'delta') {
    // Edge case: first yield was already a text delta (shouldn't happen)
    console.warn('⚠️ First yield was a delta, not sources');
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // If first yield was a delta, enqueue it now
      if (!first.done && first.value.type === 'delta' && first.value.content) {
        controller.enqueue(encoder.encode(first.value.content));
      }

      try {
        for await (const chunk of generator) {
          if (chunk.type === 'delta' && chunk.content) {
            controller.enqueue(encoder.encode(chunk.content));
          }
        }
      } catch (err: any) {
        console.error('Stream error:', err);
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'x-sources': JSON.stringify(sources),
    },
  });
}