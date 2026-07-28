# SourceMind LM

A **NotebookLM clone** built with Next.js 14, OpenAI, and Qdrant — chat with your PDFs, YouTube videos, text notes, subtitle files, and web articles using RAG (Retrieval-Augmented Generation).

🔗 **Live Demo**: [https://sourcemindlm.portfoliohub.in/](https://sourcemindlm.portfoliohub.in/)

---
## ✨ Features

| Feature | Status |
|---------|--------|
| 📄 **PDF Upload** | Extract text, chunk, embed, search |
| 🎬 **YouTube Links** | Auto-fetch transcripts, timestamp citations |
| 📝 **Text Notes** | Paste or type raw text |
| 🎞️ **VTT/SRT Subtitles** | Upload subtitle files with real timestamps |
| 🌐 **Web Links** | Scrape articles (with Jina AI fallback for JS sites) |
| 🤖 **RAG Chat** | Semantic search + GPT-4.1-mini answers |
| 🔗 **Source Citations** | Clickable chips link to exact timestamps/chunks |
| 👁️ **Source Preview** | Side panel shows PDF, video, or transcript |
| ✏️ **Rename Sources** | Inline editing |
| 🗑️ **Delete Sources** | Removes from DB, disk, and vector store |
| 🔍 **Multi-Source Search** | Chat searches all indexed sources |
| ⚡ **Streaming Responses** | Real-time character-by-character text generation |
| 📋 **Copy & Regenerate** | One-click copy or retry any AI response |
| 🔔 **Toast Notifications** | Elegant success/error feedback via Sonner |
| 🔎 **Sidebar Source Search** | Filter sources by name in real-time |
| ☑️ **Multi-Source Selection** | Chat only searches checked sources |
| ⏱️ **YouTube Timestamp Sync** | Click citations to jump to exact video time |
| 📱 **Mobile Responsive** | Collapsible sidebar with hamburger menu |

---

## 🏗️ Architecture

```text
                    ┌────────────────────────┐
                    │      SourceMind LM     │
                    └────────────┬───────────┘
                                 │
             ┌───────────────────┼────────────────────┐
             │                   │                    │
             ▼                   ▼                    ▼
        Knowledge          AI Processing        User Interface
         Sources

 PDF / YouTube / Web / Text / VTT
             │
             ▼
      Source Processing
             │
             ▼
   Transcript Processor
             │
             ▼
     Semantic Chunker
             │
             ▼
 OpenAI Embeddings (text-embedding-3-small)
             │
             ▼
        Qdrant Vector DB
             │
             ▼
      Semantic Retrieval
             │
             ▼
 GPT-4.1-mini (Streaming)
             │
             ▼
 AI Response + Source Citations
```
```

### Data Flow

1. **Upload** → Save to `/tmp` (Vercel) or `data/sources` (local)
2. **Parse** → PDF-parse / Cheerio / youtube-transcript / SRT-VTT parser
3. **Clean** → Remove `[Music]`, `♪`, normalize whitespace
4. **Chunk** → Semantic chunking (max 45s / 300 tokens / 3s pause threshold)
5. **Embed** → OpenAI `text-embedding-3-small` (1536 dims)
6. **Store** → Qdrant with metadata (courseId, lessonId, timestamps)
7. **Chat** → Embed query → Qdrant similarity search → GPT-4.1-mini with context

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key
- Qdrant instance (local Docker or [Qdrant Cloud](https://cloud.qdrant.io))
- PostgreSQL (local or [Neon](https://neon.tech) for production)

### 1. Clone & Install

```bash
git clone https://github.com/ravi8555/notebook-LM
cd notebook-LM
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=                    # optional for local

# Database (Neon PostgreSQL for production)
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### 3. Run Qdrant (Local)

```bash
docker run -p 6333:6333 qdrant/qdrant
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sources/route.ts          # List & create sources
│   │   ├── sources/[id]/route.ts     # Delete & rename
│   │   ├── sources/[id]/file/route.ts # Serve uploaded files
│   │   └── chat/route.ts             # RAG chat endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   └── ChatMessage.tsx
│   └── sources/
│       ├── AddSourceButton.tsx
│       ├── AddSourceModal.tsx
│       ├── SourceList.tsx
│       └── SourcePreview.tsx
├── services/
│   ├── SourceService.ts              # Source CRUD + indexing
│   ├── sourceServiceSingleton.ts     # Shared instance
│   ├── IndexingService.ts            # Embed + upsert to Qdrant
│   └── RAGService.ts                 # Search + LLM generation
├── course/
│   ├── TranscriptProcessor.ts        # Parse → clean → chunk
│   ├── CourseLoader.ts
│   └── CourseIndexingService.ts
├── chunking/
│   ├── SemanticChunker.ts            # Smart transcript segmentation
│   └── ChunkingOptions.ts
├── embeddings/
│   ├── EmbeddingService.ts
│   └── OpenAIEmbeddingService.ts
├── vectorstore/
│   ├── QdrantVectorStore.ts          # Qdrant client wrapper
│   ├── VectorStore.ts                # Interface
│   └── QdrantPayloadMapper.ts
├── retrieval/
│   ├── SemanticSearcher.ts           # Vector similarity search
│   └── SearchFilter.ts
├── chat/
│   ├── ChatService.ts
│   ├── OpenAIChatService.ts
│   └── AIResponse.ts
├── prompts/
│   ├── PromptBuilder.ts              # Build RAG prompt
│   └── PromptTemplate.ts             # System instructions
├── parsers/
│   ├── BaseSubtitleParser.ts
│   ├── SrtParser.ts
│   └── VttParser.ts
├── types/
│   ├── source.ts
│   ├── chunk.ts
│   └── transcript.ts
├── lib/
│   ├── context/AppContext.tsx        # React state management
│   └── db.ts                         # PostgreSQL connection
└── utils/
    ├── timestamp.ts
    ├── formatTimestamp.ts
    └── truncateText.ts
```

---

## 🔧 Configuration

### Chunking Options

Edit `src/chunking/ChunkingOptions.ts`:

```typescript
export const DEFAULT_CHUNK_OPTIONS: ChunkingOptions = {
  maxDuration: 45,      // seconds
  maxTokens: 300,       // estimated tokens
  pauseThreshold: 3,    // seconds gap → new chunk
};
```

### LLM Model

Edit `src/chat/OpenAIChatService.ts`:

```typescript
const response = await this.client.chat.completions.create({
  model: "gpt-4.1-mini",  // or "gpt-4o", "gpt-3.5-turbo"
  temperature: 0,
  messages,
});
```

---

## 🆕 New Features Guide

### ⚡ Streaming Chat Responses

The chat endpoint now returns a Server-Sent Event (SSE) stream instead of a JSON blob:

**Backend** (`src/chat/OpenAIChatService.ts`):
```typescript
const stream = await this.client.chat.completions.create({
  model: "gpt-4.1-mini",
  temperature: 0,
  messages,
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  controller.enqueue(encoder.encode(content));
}
```

**Frontend** (`src/components/chat/ChatInterface.tsx`):
```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ message, sourceIds: selectedSourceIds }),
});

const reader = response.body?.getReader();
while (reader) {
  const { done, value } = await reader.read();
  if (done) break;
  setStreamingText(prev => prev + decoder.decode(value));
}
```

### 📋 Copy & Regenerate

Each AI message includes action buttons:

```tsx
{!isUser && (
  <div className="flex gap-2 mt-2">
    <button onClick={() => navigator.clipboard.writeText(message.content)}>
      📋 Copy
    </button>
    <button onClick={() => sendMessage(message.content)}>
      🔄 Regenerate
    </button>
  </div>
)}
```

### 🔔 Toast Notifications

Replaces all `alert()` calls with elegant toasts:

```bash
npm install sonner
```

```tsx
// src/app/layout.tsx
import { Toaster } from "sonner";

// Usage anywhere
import { toast } from "sonner";
toast.success("Source indexed successfully");
toast.error("Failed to add source");
```

### 🔎 Sidebar Source Search

Filter sources in real-time via the navbar search box:

```tsx
// Navbar.tsx
const [searchQuery, setSearchQuery] = useState("");

// SourceList.tsx
const filtered = sources.filter(s =>
  s.name.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### ☑️ Multi-Source Selection

Checkbox next to each source restricts chat search scope:

```tsx
// types/source.ts
export interface Source {
  // ... existing fields
  selected?: boolean;
}

// SourceList.tsx
<input
  type="checkbox"
  checked={source.selected}
  onChange={(e) => toggleSourceSelection(source.id, e.target.checked)}
/>
```

### ⏱️ YouTube Timestamp Sync

Clicking a citation chip opens the video at the exact timestamp:

```tsx
// SourcePreview.tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}?start=${Math.floor(source.start)}`}
/>
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add Environment Variables in Dashboard:
   - `OPENAI_API_KEY`
   - `QDRANT_URL`
   - `QDRANT_API_KEY`
   - `DATABASE_URL`
4. Deploy

> ⚠️ **Vercel uses `/tmp` for file storage** — configure Neon PostgreSQL for persistent source metadata.

### Self-Hosted

```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `EROFS: read-only file system` | Use `/tmp` for uploads on Vercel, or self-host |
| `Cannot find module 'youtube-transcript'` | `npm install youtube-transcript` |
| Qdrant returns 0 results | Check collection exists; verify `courseId` in metadata |
| "I couldn't find this information" | LLM can't answer from context — try rephrasing or check if source is indexed |
| Source chips not clickable | Ensure `sourceId` matches between backend `lessonId` and frontend `source.id` |

---

## 🛣️ Roadmap

- [ ] Multi-source selection (checkbox filter)
- [ ] Streaming chat responses
- [ ] PDF page number extraction (instead of chunk numbers)
- [ ] Mobile responsive sidebar
- [ ] Source folders/tags
- [ ] Export chat history
- [ ] Audio playback with transcript sync

---

## 📝 License

MIT — built for learning and portfolio demonstration.

---

## 🙏 Acknowledgments

- [NotebookLM](https://notebooklm.google.com) for the UI inspiration
- [Qdrant](https://qdrant.tech) for vector search
- [OpenAI](https://openai.com) for embeddings and LLM
