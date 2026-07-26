// export type SourceType = 'pdf' | 'youtube' | 'text' | 'vtt' | 'weblink';
// export type SourceStatus = 'pending' | 'indexing' | 'indexed' | 'error';

// export interface Source {
//   id: string;
//   name: string;
//   type: SourceType;
//   status: SourceStatus;
//   content?: string;      // for text/weblink
//   url?: string;          // for youtube/weblink
//   filePath?: string;     // for pdf/vtt
//   courseId: string;
//   createdAt: string;
//   error?: string;
// }

// export interface ChatMessage {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   sources?: SourceReference[];
//   createdAt: string;
// }

// export interface SourceReference {
//   sourceId: string;
//   name: string;
//   start: number;
//   end: number;
// }


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