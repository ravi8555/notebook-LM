// // src/app/api/chat/route.ts
// import { NextRequest, NextResponse } from 'next/server';
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

//   // Only filter if user explicitly selected specific sources
//   // Otherwise search across ALL indexed sources (default NotebookLM behavior)
//   let filter: SearchFilter | undefined;
  
//   if (sourceIds && sourceIds.length > 0) {
//     // If single source selected, filter by it
//     if (sourceIds.length === 1) {
//       filter = { courseId: sourceIds[0] };
//     }
//     // If multiple sources selected, we need multi-match (see Qdrant fix below)
//     // For now, no filter = search all (better than searching only first)
//   }

//   const response = await rag.ask(question, filter);
//   return NextResponse.json(response);
// }


import { NextRequest, NextResponse } from 'next/server';
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

// export async function POST(req: NextRequest) {
//   const { question } = await req.json();
  
//   console.log('💬 Chat question:', question);

//   const response = await rag.ask(question); // NO filter — search all sources

//   // console.log('💬 Chat response:', {
//   //   answerPreview: response.answer.slice(0, 100),
//   //   sourceCount: response.sources?.length ?? 0,
//   //   sources: response.sources?.map(s => s.lesson),
//   // });

//   return NextResponse.json(response);
// }

export async function POST(req: NextRequest) {
  const { question, sourceIds } = await req.json();

  // Only search the provided source IDs (indexed sources from frontend)
  let filter: SearchFilter | undefined;
  if (sourceIds && sourceIds.length > 0) {
    filter = { courseIds: sourceIds };
  }

  const response = await rag.ask(question, filter);
  return NextResponse.json(response);
}