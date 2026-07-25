# 🎓 Course RAG AI

A production-ready **Retrieval-Augmented Generation (RAG)** system that transforms course transcripts (`.srt` / `.vtt`) into an AI-powered question-answering assistant using **OpenAI Embeddings**, **Qdrant Vector Database**, and **GPT-4.1 Mini**.

Users can ask natural language questions about an entire course and receive grounded answers with source citations.

---

# ✨ Features

- 📄 Parse SRT & VTT transcript files
- 🧹 Transcript cleaning & normalization
- ✂️ Semantic transcript chunking
- 🧠 OpenAI Embeddings (`text-embedding-3-small`)
- 📦 Qdrant Vector Database
- 🔍 Semantic similarity search
- 🤖 GPT-4.1 Mini answer generation
- 📚 Source citation with lesson & timestamps
- 🚀 Multi-document course indexing
- 🏗️ Modular architecture for future API & UI integration

---

# 🏛️ Architecture

```text
                 Course Folder
                       │
                       ▼
                CourseLoader
                       │
                       ▼
            TranscriptProcessor
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   Transcript Cleaner          Semantic Chunker
                       │
                       ▼
              Document Chunks
                       │
                       ▼
          OpenAI Embeddings API
                       │
                       ▼
             Qdrant Vector Store
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
      Semantic Search         Prompt Builder
                       │
                       ▼
               GPT-4.1 Mini
                       │
                       ▼
          Grounded AI Response
```

---

# 📂 Project Structure

```text
src/

├── chat/
│   ├── AIResponse.ts
│   ├── ChatMessage.ts
│   ├── ChatService.ts
│   └── OpenAIChatService.ts
│
├── chunking/
│   └── SemanticChunker.ts
│
├── cleaner/
│   └── TranscriptCleaner.ts
│
├── course/
│   ├── Course.ts
│   ├── CourseLoader.ts
│   ├── TranscriptProcessor.ts
│   ├── CourseIndexingService.ts
│   └── index.ts
│
├── embeddings/
│   └── OpenAIEmbeddingService.ts
│
├── parsers/
│   ├── SrtParser.ts
│   ├── VttParser.ts
│   └── Parser.ts
│
├── prompts/
│   ├── PromptBuilder.ts
│   └── PromptTemplate.ts
│
├── retrieval/
│   └── SemanticSearcher.ts
│
├── services/
│   ├── IndexingService.ts
│   └── RAGService.ts
│
├── vectorstore/
│   └── QdrantVectorStore.ts
│
├── tests/
│
└── index.ts
```

---

# 🚀 Pipeline

## Indexing

```text
Transcript Files

↓

Parser

↓

Cleaner

↓

Semantic Chunker

↓

OpenAI Embeddings

↓

Qdrant
```

---

## Retrieval

```text
User Question

↓

Embedding

↓

Semantic Search

↓

Relevant Chunks

↓

Prompt Builder

↓

GPT-4.1 Mini

↓

Answer + Sources
```

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| LLM | GPT-4.1 Mini |
| Embeddings | text-embedding-3-small |
| Vector Database | Qdrant |
| Environment | dotenv |
| Package Manager | npm |

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/course-rag-ai.git

cd course-rag-ai
```

Install dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file

```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
```

---

# ▶️ Running

Development

```bash
npm run dev
```

---

# 📚 Index a Course

```text
Course Folder

data/

├── Lesson01.srt
├── Lesson02.srt
├── Lesson03.srt
└── ...
```

```typescript
const loader = new CourseLoader();

const course = await loader.load(
    "./data",
    "react-native-course",
    "React Native Bootcamp"
);

const indexer = new CourseIndexingService();

await indexer.index(course);
```

---

# 💬 Ask Questions

```typescript
const answer = await rag.ask(
    "What are the types of mobile apps?"
);

console.log(answer.answer);

console.table(answer.sources);
```

---

# Example Output

```text
The three main types of mobile apps are:

• Native Apps
• Cross Platform Apps
• Hybrid Apps
```

Sources

```text
Lesson:
01 What is Mobile Development

04:02 – 04:44

04:44 – 05:26
```

---

# 🧪 Tests

| Test | Description |
|------|-------------|
| Test 1 | Parser |
| Test 2 | Cleaner |
| Test 3 | Chunker |
| Test 4 | Embeddings |
| Test 5 | Vector Store |
| Test 6 | Semantic Search |
| Test 7 | Prompt Builder |
| Test 8 | End-to-End RAG |
| Test 9 | Course Loader |
| Test 10 | Transcript Processor |
| Test 11 | Course Indexer |

---

# Current Features

- ✅ SRT Parser
- ✅ VTT Parser
- ✅ Transcript Cleaning
- ✅ Semantic Chunking
- ✅ OpenAI Embeddings
- ✅ Qdrant Integration
- ✅ Semantic Search
- ✅ Prompt Builder
- ✅ GPT Integration
- ✅ Source Citations
- ✅ Multi-document Course Loading
- ✅ Transcript Processing
- ✅ Course Indexing

---

# 🚧 Roadmap

## Sprint 1
- [x] Transcript Parsing
- [x] Cleaning
- [x] Chunking

## Sprint 2
- [x] Embeddings
- [x] Vector Database
- [x] Retrieval
- [x] GPT Integration

## Sprint 3
- [x] Multi-document Loading
- [x] Course Indexing
- [x] Batch Course Embedding
- [x] Metadata Filtering

<!-- -## Sprint 4
- [ ] REST API
- [ ] Express Server
- [ ] Swagger Documentation

## Sprint 5
- [ ] React Frontend
- [ ] Chat Interface
- [ ] Streaming Responses

## Sprint 6
- [ ] Authentication
- [ ] Multi-user Support
- [ ] Persistent Chat History -->

---

# Future Enhancements

- PDF ingestion
- DOCX ingestion
- YouTube transcript support
- Metadata filtering
- Hybrid Search (Keyword + Vector)
- Streaming responses
- Redis caching
- Multi-course support
- Evaluation metrics
- LangSmith tracing

---

# License

MIT License

---

# Author

**Ravindra Dhadave**

Senior Frontend Engineer | Full Stack Developer | AI Engineer

Passionate about building AI-powered developer tools, Retrieval-Augmented Generation (RAG) systems, and modern full-stack applications.