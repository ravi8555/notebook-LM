export type SourceType = 'pdf' | 'youtube' | 'text' | 'vtt' | 'weblink';
export type SourceStatus = 'pending' | 'indexing' | 'indexed' | 'error';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  content?: string;
  url?: string;
  filePath?: string;
  courseId: string;
  createdAt: string;
  error?: string;
  selected?: boolean; // ← UI state: included in chat search
}

export interface SourceReference {
  sourceId: string;
  name: string;
  start: number;
  end: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceReference[];
  createdAt: string;
}