import { SourceService } from './SourceService';
import { IndexingService } from './IndexingService';
import { OpenAIEmbeddingService } from '../embeddings/OpenAIEmbeddingService';
import { QdrantVectorStore } from '../vectorstore';

const vectorStore = new QdrantVectorStore();
const embeddingService = new OpenAIEmbeddingService();
const indexingService = new IndexingService(embeddingService, vectorStore);

// Singleton — shared across all API routes
export const sourceService = new SourceService(indexingService, vectorStore);