import { NextRequest, NextResponse } from 'next/server';
import { QdrantVectorStore } from '@/vectorstore';
import { OpenAIEmbeddingService } from '@/embeddings/OpenAIEmbeddingService';
import { IndexingService } from '@/services/IndexingService';
// import { SourceService } from '@/services/SourceService';
import { sourceService } from '@/services/sourceServiceSingleton';

// Lazy init — don't construct at import time (avoids env var errors on module load)
// let sourceService: SourceService | null = null;

// function getSourceService() {
//   if (!sourceService) {
//     const vectorStore = new QdrantVectorStore();
//     const embeddingService = new OpenAIEmbeddingService();
//     const indexingService = new IndexingService(embeddingService, vectorStore);
//     sourceService = new SourceService(indexingService, vectorStore);
//   }
//   return sourceService;
// }
// Ensure Qdrant collection exists
let collectionReady = false;
async function ensureCollection() {
  if (!collectionReady) {
    const { QdrantVectorStore } = await import('@/vectorstore');
    const store = new QdrantVectorStore();
    await store.createCollection();
    collectionReady = true;
  }
}

export async function GET() {
  return NextResponse.json({ sources: sourceService.getAll() });
}

export async function POST(req: NextRequest) {
  await ensureCollection();

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const type = formData.get('type') as any;
  const url = (formData.get('url') as string) || undefined;
  const content = (formData.get('content') as string) || undefined;
  const file = formData.get('file') as File | null;

  let buffer: Buffer | undefined;
  let originalName: string | undefined;

  if (file) {
    const bytes = await file.arrayBuffer();
    buffer = Buffer.from(bytes);
    originalName = file.name;
  }

  const source = await sourceService.addSource(name, type, content, url, buffer, originalName);
  return NextResponse.json({ source });
}




// import { NextRequest, NextResponse } from 'next/server';
// import { QdrantVectorStore } from '@/vectorstore';
// import { OpenAIEmbeddingService } from '@/embeddings/OpenAIEmbeddingService';
// import { IndexingService } from '@/services/IndexingService';
// import { SourceService } from '@/services/SourceService';

// const vectorStore = new QdrantVectorStore();
// const embeddingService = new OpenAIEmbeddingService();
// const indexingService = new IndexingService(embeddingService, vectorStore);
// const sourceService = new SourceService(indexingService, vectorStore);

// // Ensure Qdrant collection exists (lazy init)
// let collectionReady = false;
// async function ensureCollection() {
//   if (!collectionReady) {
//     await vectorStore.createCollection();
//     collectionReady = true;
//   }
// }

// export async function GET() {
//   return NextResponse.json({ sources: sourceService.getAll() });
// }

// export async function POST(req: NextRequest) {
//   await ensureCollection();

//   const formData = await req.formData();
//   const name = formData.get('name') as string;
//   const type = formData.get('type') as any;
//   const url = (formData.get('url') as string) || undefined;
//   const content = (formData.get('content') as string) || undefined;
//   const file = formData.get('file') as File | null;

//   let buffer: Buffer | undefined;
//   let originalName: string | undefined;

//   if (file) {
//     const bytes = await file.arrayBuffer();
//     buffer = Buffer.from(bytes);
//     originalName = file.name;
//   }

//   const source = await sourceService.addSource(name, type, content, url, buffer, originalName);
//   return NextResponse.json({ source });
// }





// // import { NextRequest, NextResponse } from 'next/server';
// // import { SourceService } from '@/services/SourceService';
// // import { CourseIndexingService } from '@/course/CourseIndexingService';
// // import { TranscriptProcessor } from '@/course/TranscriptProcessor';
// // import { IndexingService } from '@/services/IndexingService';
// // import { OpenAIEmbeddingService } from '@/embeddings/OpenAIEmbeddingService';
// // import { QdrantVectorStore } from '@/vectorstore'; // your existing implementation

// // const vectorStore = new QdrantVectorStore();
// // const embeddingService = new OpenAIEmbeddingService();
// // const indexingService = new IndexingService(embeddingService, vectorStore);
// // const courseIndexing = new CourseIndexingService(new TranscriptProcessor(), indexingService);
// // const sourceService = new SourceService(courseIndexing);

// // export async function GET() {
// //   return NextResponse.json({ sources: sourceService.getAll() });
// // }

// // export async function POST(req: NextRequest) {
// //   const formData = await req.formData();
// //   const name = formData.get('name') as string;
// //   const type = formData.get('type') as any;
// //   const url = (formData.get('url') as string) || undefined;
// //   const content = (formData.get('content') as string) || undefined;
// //   const file = formData.get('file') as File | null;

// //   let buffer: Buffer | undefined;
// //   let originalName: string | undefined;

// //   if (file) {
// //     const bytes = await file.arrayBuffer();
// //     buffer = Buffer.from(bytes);
// //     originalName = file.name;
// //   }

// //   const source = await sourceService.addSource(
// //     name,
// //     type,
// //     content,
// //     url,
// //     buffer,
// //     originalName
// //   );

// //   return NextResponse.json({ source });
// // }