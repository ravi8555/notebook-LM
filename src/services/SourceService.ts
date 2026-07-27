// src/services/SourceService.ts
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Source, SourceType, SourceStatus } from '../types/source';
import { Course, CourseLesson } from '../course/Course';
import { TranscriptProcessor } from '../course/TranscriptProcessor';
import { IndexingService } from './IndexingService';
import { QdrantVectorStore } from '../vectorstore';
import { query } from '../lib/db';

const UPLOAD_DIR = '/tmp/uploads';

export class SourceService {
  private processor = new TranscriptProcessor();

  constructor(
    private readonly indexingService: IndexingService,
    private readonly vectorStore: QdrantVectorStore
  ) {
    this.ensureDirs();
  }

  private async ensureDirs() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  async getAll(): Promise<Source[]> {
    const res = await query('SELECT * FROM sources ORDER BY created_at DESC');
    return res.rows.map(this.rowToSource);
  }

  async getById(id: string): Promise<Source | undefined> {
    const res = await query('SELECT * FROM sources WHERE id = $1', [id]);
    return res.rows[0] ? this.rowToSource(res.rows[0]) : undefined;
  }

  async addSource(
    name: string,
    type: SourceType,
    content?: string,
    url?: string,
    fileBuffer?: Buffer,
    originalName?: string
  ): Promise<Source> {
    const id = uuid();
    const courseId = `course-${id}`;
    let filePath: string | undefined;

    if (fileBuffer && originalName) {
      const ext = path.extname(originalName);
      const safeName = `${id}${ext}`;
      filePath = path.join(UPLOAD_DIR, safeName);
      await fs.writeFile(filePath, fileBuffer);
    } else if (content && type === 'text') {
      const safeName = `${id}.txt`;
      filePath = path.join(UPLOAD_DIR, safeName);
      await fs.writeFile(filePath, content);
    }

    const source: Source = {
      id,
      name: name || originalName || 'Untitled',
      type,
      status: 'pending',
      content,
      url,
      filePath,
      courseId,
      createdAt: new Date().toISOString(),
    };

    await query(
      `INSERT INTO sources (id, name, type, status, content, url, file_path, course_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [source.id, source.name, source.type, source.status, source.content, source.url, source.filePath, source.courseId, source.createdAt]
    );

    // Background indexing
    this.indexSource(source).catch((err) => {
      console.error('Background indexing failed:', err);
      this.updateStatus(source.id, 'error', String(err));
    });

    return source;
  }

  private async fetchWebPage(url: string): Promise<string> {
    console.log(`🌐 Fetching: ${url}`);

    // Strategy 1: Direct fetch
    try {
      const text = await this.tryDirectFetch(url);
      if (text.length > 200) {
        console.log(`🌐 Direct fetch: ${text.length} chars`);
        return text;
      }
    } catch {
      console.log('🌐 Direct fetch failed, trying Jina AI...');
    }

    // Strategy 2: Jina AI Reader
    try {
      const jinaUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`;
      const response = await fetch(jinaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) throw new Error(`Jina AI: ${response.status}`);
      
      const text = await response.text();
      const cleaned = text.replace(/\s+/g, ' ').trim();
      if (cleaned.length > 200) {
        console.log(`🌐 Jina AI: ${cleaned.length} chars`);
        return cleaned;
      }
    } catch (err) {
      console.log('🌐 Jina AI failed:', err);
    }

    throw new Error('Could not extract content. Try pasting text manually.');
  }

  private async tryDirectFetch(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, aside, iframe, noscript, svg, canvas, form, button, input, textarea, select').remove();

    let text = $('article').text() || $('main').text() || $('[role="main"]').text() || $('#content').text() || $('.content').text();
    
    if (!text || text.length < 100) {
      const paragraphs: string[] = [];
      $('body p').each((_: any, el: any) => {
        const t = $(el).text().trim();
        if (t.length > 20) paragraphs.push(t);
      });
      text = paragraphs.join('\n\n');
    }
    if (!text || text.length < 50) text = $('body').text();
    
    return text.replace(/\s+/g, ' ').trim();
  }

  private async indexSource(source: Source) {
    await this.updateStatus(source.id, 'indexing');

    try {
      let lessonFilePath = source.filePath || '';
      let lessonSource: 'srt' | 'vtt' = 'srt';

      // PDF: extract text → SRT
      if (source.type === 'pdf' && lessonFilePath) {
        const pdfParse = await import('pdf-parse');
        const buffer = await fs.readFile(lessonFilePath);
        const pdfData = await pdfParse.default(buffer);
        
        const srtPath = path.join(UPLOAD_DIR, `${source.id}.srt`);
        await this.textToSrt(pdfData.text, srtPath);
        lessonFilePath = srtPath;
        lessonSource = 'srt';
      }

      // Text: convert to SRT
      else if (source.type === 'text' && lessonFilePath) {
        const text = await fs.readFile(lessonFilePath, 'utf8');
        const srtPath = path.join(UPLOAD_DIR, `${source.id}.srt`);
        await this.textToSrt(text, srtPath);
        lessonFilePath = srtPath;
        lessonSource = 'srt';
      }

      // Weblink: fetch → SRT
      else if (source.type === 'weblink' && source.url) {
        const text = await this.fetchWebPage(source.url);
        const srtPath = path.join(UPLOAD_DIR, `${source.id}.srt`);
        await this.textToSrt(text, srtPath);
        lessonFilePath = srtPath;
        lessonSource = 'srt';
      }

      // YouTube: fetch transcript → SRT
      else if (source.type === 'youtube' && source.url) {
        const srtPath = path.join(UPLOAD_DIR, `${source.id}.srt`);
        await this.extractYouTubeTranscript(source.url, srtPath);
        lessonFilePath = srtPath;
        lessonSource = 'srt';
      }

      // VTT/SRT upload: use directly
      else if (source.type === 'vtt' && lessonFilePath) {
        const ext = path.extname(lessonFilePath).toLowerCase();
        lessonSource = ext === '.vtt' ? 'vtt' : 'srt';
      }

      if (!lessonFilePath) throw new Error('No file to process');

      const lesson: CourseLesson = {
        id: `lesson-${source.id}`,
        title: source.name,
        order: 1,
        filePath: lessonFilePath,
        source: lessonSource,
      };

      const course: Course = {
        id: source.courseId,
        title: source.name,
        lessons: [lesson],
      };

      const chunks = await this.processor.process(course, lesson);
      await this.indexingService.index(chunks);

      await this.updateStatus(source.id, 'indexed');
    } catch (err: any) {
      console.error('Indexing failed:', err);
      await this.updateStatus(source.id, 'error', err.message);
    }
  }

  private async textToSrt(text: string, outPath: string) {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) throw new Error('No text content to index');

    const wordsPerSegment = 25;
    const segments: string[] = [];
    let segId = 1;

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const chunk = words.slice(i, i + wordsPerSegment).join(' ');
      const start = this.secondsToSrtTime((segId - 1) * 10);
      const end = this.secondsToSrtTime(segId * 10);
      segments.push(`${segId}\n${start} --> ${end}\n${chunk}\n`);
      segId++;
    }
    await fs.writeFile(outPath, segments.join('\n'));
  }

  private secondsToSrtTime(sec: number): string {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},000`;
  }

  private async extractYouTubeTranscript(url: string, outPath: string) {
    try {
      const { YoutubeTranscript } = await import('youtube-transcript');
      const transcript = await YoutubeTranscript.fetchTranscript(url);
      const segments: string[] = [];
      transcript.forEach((item: any, idx: number) => {
        const start = this.secondsToSrtTime(item.offset / 1000);
        const end = this.secondsToSrtTime((item.offset + item.duration) / 1000);
        segments.push(`${idx + 1}\n${start} --> ${end}\n${item.text}\n`);
      });
      await fs.writeFile(outPath, segments.join('\n'));
    } catch {
      await fs.writeFile(outPath, `1\n00:00:00,000 --> 00:00:05,000\nFailed to fetch YouTube transcript.\n`);
      throw new Error('YouTube transcript fetch failed');
    }
  }

  // ✅ FIXED: Updates DB instead of stale Map
  private async updateStatus(id: string, status: SourceStatus, error?: string) {
    await query('UPDATE sources SET status = $1 WHERE id = $2', [status, id]);
    if (error) {
      console.error(`Source ${id} error:`, error);
    }
  }

  // ✅ FIXED: Reads from DB, deletes from DB + Qdrant + disk
  async deleteSource(id: string): Promise<void> {
    const source = await this.getById(id);
    if (!source) {
      console.log(`Source ${id} already deleted`);
      return;
    }

    console.log(`🗑️ Deleting source: ${source.name}`);

    // 1. Delete from DB
    await query('DELETE FROM sources WHERE id = $1', [id]);

    // 2. Delete vectors from Qdrant
    try {
      await this.vectorStore.deleteByCourseId(source.courseId);
      console.log(`🗑️ Deleted Qdrant vectors for ${source.courseId}`);
    } catch (err: any) {
      console.warn('⚠️ Qdrant delete failed:', err.message);
    }

    // 3. Delete files from /tmp
    const extensions = ['.pdf', '.txt', '.vtt', '.srt'];
    for (const ext of extensions) {
      const filePath = path.join(UPLOAD_DIR, `${id}${ext}`);
      try { await fs.unlink(filePath); } catch { /* ignore */ }
    }

    console.log(`🗑️ Source ${id} deleted`);
  }

  // ✅ FIXED: Only touches DB
  async renameSource(id: string, newName: string): Promise<void> {
    const res = await query('UPDATE sources SET name = $1 WHERE id = $2 RETURNING *', [newName, id]);
    if (res.rowCount === 0) throw new Error('Source not found');
  }

  private rowToSource(row: any): Source {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      content: row.content,
      url: row.url,
      filePath: row.file_path,
      courseId: row.course_id,
      createdAt: row.created_at,
    };
  }
}





// creating JSON and fetching - vercel doesnt provide this, so stored in neon

// import fs from 'fs/promises';
// import path from 'path';
// import { v4 as uuid } from 'uuid';
// import { Source, SourceType, SourceStatus } from '../types/source';
// import { Course, CourseLesson } from '../course/Course';
// import { CourseIndexingService } from '../course/CourseIndexingService';
// import { TranscriptProcessor } from '../course/TranscriptProcessor';
// import { IndexingService } from './IndexingService';

// const DATA_DIR = path.join(process.cwd(), 'data', 'sources');
// const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

// // Simple JSON persistence for demo; swap for DB in production
// const DB_PATH = path.join(DATA_DIR, 'sources.json');

// export class SourceService {
//   private sources: Map<string, Source> = new Map();
//   private indexingService: CourseIndexingService;

//   constructor(indexingService: CourseIndexingService) {
//     this.indexingService = indexingService;
//     this.ensureDirs();
//     this.load();
//   }

//   private async ensureDirs() {
//     await fs.mkdir(UPLOAD_DIR, { recursive: true });
//     await fs.mkdir(DATA_DIR, { recursive: true });
//   }

//   private async load() {
//     try {
//       const raw = await fs.readFile(DB_PATH, 'utf8');
//       const arr: Source[] = JSON.parse(raw);
//       arr.forEach((s) => this.sources.set(s.id, s));
//     } catch {
//       // no db yet
//     }
//   }

//   private async save() {
//     const arr = Array.from(this.sources.values());
//     await fs.writeFile(DB_PATH, JSON.stringify(arr, null, 2));
//   }

//   getAll(): Source[] {
//     return Array.from(this.sources.values()).sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//   }

//   getById(id: string): Source | undefined {
//     return this.sources.get(id);
//   }

//   async addSource(
//     name: string,
//     type: SourceType,
//     content?: string,
//     url?: string,
//     fileBuffer?: Buffer,
//     originalName?: string
//   ): Promise<Source> {
//     const id = uuid();
//     const courseId = `course-${id}`;
//     let filePath: string | undefined;

//     if (fileBuffer && originalName) {
//       const ext = path.extname(originalName);
//       const safeName = `${id}${ext}`;
//       filePath = path.join(UPLOAD_DIR, safeName);
//       await fs.writeFile(filePath, fileBuffer);
//     } else if (content && type === 'text') {
//       const safeName = `${id}.txt`;
//       filePath = path.join(UPLOAD_DIR, safeName);
//       await fs.writeFile(filePath, content);
//     }

//     const source: Source = {
//       id,
//       name: name || originalName || 'Untitled',
//       type,
//       status: 'pending',
//       content,
//       url,
//       filePath,
//       courseId,
//       createdAt: new Date().toISOString(),
//     };

//     this.sources.set(id, source);
//     await this.save();

//     // Kick off background indexing
//     this.indexSource(source).catch(console.error);

//     return source;
//   }

//   private async indexSource(source: Source) {
//     this.updateStatus(source.id, 'indexing');

//     try {
//       const lesson: CourseLesson = {
//         id: `lesson-${source.id}`,
//         title: source.name,
//         order: 1,
//         filePath: source.filePath || '',
//         source: source.type === 'vtt' ? 'vtt' : 'srt',
//       };

//       // For non-subtitle types, we need to create a subtitle-like file first
//       if (source.type === 'pdf' || source.type === 'text' || source.type === 'weblink') {
//         // Convert to pseudo-SRT format for existing pipeline
//         const text = source.content || (source.filePath ? await fs.readFile(source.filePath, 'utf8') : '');
//         const srtPath = path.join(UPLOAD_DIR, `${source.id}.srt`);
//         await this.textToSrt(text, srtPath);
//         lesson.filePath = srtPath;
//         lesson.source = 'srt';
//       }

//       if (source.type === 'youtube' && source.url) {
//         // Extract transcript and save as VTT (requires youtube-transcript package)
//         const vttPath = path.join(UPLOAD_DIR, `${source.id}.vtt`);
//         await this.extractYouTubeTranscript(source.url, vttPath);
//         lesson.filePath = vttPath;
//         lesson.source = 'vtt';
//       }

//       const course: Course = {
//         id: source.courseId,
//         title: source.name,
//         lessons: [lesson],
//       };

//       await this.indexingService.rebuildCourse(course);
//       this.updateStatus(source.id, 'indexed');
//     } catch (err: any) {
//       console.error('Indexing failed:', err);
//       this.updateStatus(source.id, 'error', err.message);
//     }
//   }

//   private async textToSrt(text: string, outPath: string) {
//     // Chunk text into ~10 second pseudo-segments for compatibility
//     const words = text.split(/\s+/);
//     const wordsPerSegment = 25;
//     const segments: string[] = [];
//     let segId = 1;
//     for (let i = 0; i < words.length; i += wordsPerSegment) {
//       const chunk = words.slice(i, i + wordsPerSegment).join(' ');
//       const startSec = (segId - 1) * 10;
//       const endSec = segId * 10;
//       const start = this.secondsToSrtTime(startSec);
//       const end = this.secondsToSrtTime(endSec);
//       segments.push(`${segId}\n${start} --> ${end}\n${chunk}\n`);
//       segId++;
//     }
//     await fs.writeFile(outPath, segments.join('\n'));
//   }

//   private secondsToSrtTime(sec: number): string {
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = Math.floor(sec % 60);
//     const ms = 0;
//     return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
//   }

//   private async extractYouTubeTranscript(url: string, outPath: string) {
//     // Install: npm install youtube-transcript
//     const { YoutubeTranscript } = await import('youtube-transcript');
//     const transcript = await YoutubeTranscript.fetchTranscript(url);
//     const segments: string[] = [];
//     transcript.forEach((item, idx) => {
//       const start = this.secondsToSrtTime(item.offset / 1000);
//       const end = this.secondsToSrtTime((item.offset + item.duration) / 1000);
//       segments.push(`${idx + 1}\n${start} --> ${end}\n${item.text}\n`);
//     });
//     await fs.writeFile(outPath, segments.join('\n'));
//   }

//   private updateStatus(id: string, status: SourceStatus, error?: string) {
//     const s = this.sources.get(id);
//     if (s) {
//       s.status = status;
//       if (error) s.error = error;
//       this.save();
//     }
//   }
// }