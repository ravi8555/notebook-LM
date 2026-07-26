// 'use client';

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Source, ChatMessage } from '@/types/source';

interface AppContextType {
  sources: Source[];
  messages: ChatMessage[];
  previewSource: Source | null;
  isAddModalOpen: boolean;
  isLoading: boolean;
  setPreviewSource: (source: Source | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  refreshSources: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  renameSource: (id: string, name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSources = useCallback(async () => {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources);
      }
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    }
  }, []);

  useEffect(() => {
    refreshSources();
    const interval = setInterval(refreshSources, 3000);
    return () => clearInterval(interval);
  }, [refreshSources]);

  // const sendMessage = useCallback(async (content: string) => {
  //   const userMsg: ChatMessage = {
  //     id: crypto.randomUUID(),
  //     role: 'user',
  //     content,
  //     createdAt: new Date().toISOString(),
  //   };
  //   setMessages((prev) => [...prev, userMsg]);
  //   setIsLoading(true);

  //   try {
  //     const res = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         question: content,
  //       }),
  //     });
  //     const data = await res.json();

  //     const assistantMsg: ChatMessage = {
  //       id: crypto.randomUUID(),
  //       role: 'assistant',
  //       content: data.answer,
  //       sources: data.sources?.map((s: any) => ({
  //         sourceId: s.lessonId,
  //         name: s.lesson,
  //         start: s.start,
  //         end: s.end,
  //       })),
  //       createdAt: new Date().toISOString(),
  //     };
  //     setMessages((prev) => [...prev, assistantMsg]);
  //   } catch (err) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: crypto.randomUUID(),
  //         role: 'assistant',
  //         content: 'Sorry, something went wrong. Please try again.',
  //         createdAt: new Date().toISOString(),
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);
 const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  
  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
 
    

    try {
      // ✅ Only search sources that are fully indexed
      const indexedSourceIds = sources
        .filter((s) => s.status === 'indexed')
        .map((s) => s.courseId);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: content,
          sourceIds: indexedSourceIds,
        }),
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources?.map((s: any) => ({
          sourceId: s.lessonId,
          name: s.lesson,
          start: s.start,
          end: s.end,
        })),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [sources]); // ✅ sources is a dependency

  return (
    <AppContext.Provider
      value={{
        sources,
        messages,
        previewSource,
        isAddModalOpen,
        isLoading,
        setPreviewSource,
        setIsAddModalOpen,
        sendMessage,
        refreshSources,
      
         deleteSource: async (id) => {
          // Optimistic: remove from UI immediately
          setSources((prev) => prev.filter((s) => s.id !== id));
          if (previewSource?.id === id) setPreviewSource(null);
          
          try {
            const res = await fetch(`/api/sources/${id}`, { method: 'DELETE' });
            // Even if 404 (already deleted), we're fine
            await refreshSources();
          } catch (err) {
            console.error('Delete failed:', err);
            // Revert optimistic update by refreshing
            await refreshSources();
          }
        },
        renameSource: async (id, name) => {
          const res = await fetch(`/api/sources/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          });
          if (!res.ok) throw new Error('Rename failed');
          await refreshSources();
        },
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}



// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { Source, ChatMessage, SourceReference } from '@/types/source';

// interface AppContextType {
//   sources: Source[];
//   messages: ChatMessage[];
//   previewSource: Source | null;
//   isAddModalOpen: boolean;
//   isLoading: boolean;
//   setPreviewSource: (source: Source | null) => void;
//   setIsAddModalOpen: (open: boolean) => void;
//   sendMessage: (content: string) => Promise<void>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// const MOCK_SOURCES: Source[] = [
//   {
//     id: '1',
//     name: 'React.pdf',
//     type: 'pdf',
//     status: 'indexed',
//     courseId: 'course-1',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: '2',
//     name: 'Node.pdf',
//     type: 'pdf',
//     status: 'indexing',
//     courseId: 'course-2',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: '3',
//     name: 'React Course',
//     type: 'youtube',
//     status: 'indexed',
//     url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
//     courseId: 'course-3',
//     createdAt: new Date().toISOString(),
//   },
// ];

// const MOCK_MESSAGES: ChatMessage[] = [
//   {
//     id: 'm1',
//     role: 'user',
//     content: 'What is Expo?',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'm2',
//     role: 'assistant',
//     content: 'Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React. It provides a set of tools and services built around React Native to help you develop, build, deploy, and quickly iterate on iOS, Android, and web apps.',
//     sources: [
//       { sourceId: '1', name: 'React.pdf', start: 120, end: 145 },
//       { sourceId: '3', name: 'React Course', start: 45, end: 62 },
//     ],
//     createdAt: new Date().toISOString(),
//   },
// ];

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
//   const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
//   const [previewSource, setPreviewSource] = useState<Source | null>(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const sendMessage = useCallback(async (content: string) => {
//     const userMsg: ChatMessage = {
//       id: crypto.randomUUID(),
//       role: 'user',
//       content,
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     setIsLoading(true);

//     // Simulate AI delay
//     await new Promise((r) => setTimeout(r, 1500));

//     const assistantMsg: ChatMessage = {
//       id: crypto.randomUUID(),
//       role: 'assistant',
//       content: `This is a simulated response for: "${content}".\n\nIn the real app, this will call your RAG backend.`,
//       sources: [
//         { sourceId: '1', name: 'React.pdf', start: 10, end: 30 },
//       ],
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, assistantMsg]);
//     setIsLoading(false);
//   }, []);

//   return (
//     <AppContext.Provider
//       value={{
//         sources,
//         messages,
//         previewSource,
//         isAddModalOpen,
//         isLoading,
//         setPreviewSource,
//         setIsAddModalOpen,
//         sendMessage,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be used within AppProvider');
//   return ctx;
// }