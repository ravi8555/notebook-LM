// 'use client';

// import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// import { Source, ChatMessage, SourceReference } from '@/types/source';

// interface AppContextType {
//   sources: Source[];
//   messages: ChatMessage[];
//   previewSource: Source | null;
//   isAddModalOpen: boolean;
//   isLoading: boolean;
//   setPreviewSource: (source: Source | null) => void;
//   setIsAddModalOpen: (open: boolean) => void;
//   refreshSources: () => Promise<void>;
//   sendMessage: (content: string) => Promise<void>;
//   deleteSource: (id: string) => Promise<void>;
//   renameSource: (id: string, name: string) => Promise<void>;
// }

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [sources, setSources] = useState<Source[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [previewSource, setPreviewSource] = useState<Source | null>(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const refreshSources = useCallback(async () => {
//     try {
//       const res = await fetch('/api/sources');
//       if (res.ok) {
//         const data = await res.json();
//         setSources(Array.isArray(data.sources) ? data.sources : []);
//       }
//     } catch (err) {
//       console.error('Failed to fetch sources:', err);
//     }
//   }, []);

//   useEffect(() => {
//     refreshSources();
//     const interval = setInterval(refreshSources, 3000);
//     return () => clearInterval(interval);
//   }, [refreshSources]);

//   const sendMessage = useCallback(async (content: string) => {
//     const userMsg: ChatMessage = {
//       id: crypto.randomUUID(),
//       role: 'user',
//       content,
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     setIsLoading(true);

//     const assistantId = crypto.randomUUID();
//     const assistantMsg: ChatMessage = {
//       id: assistantId,
//       role: 'assistant',
//       content: '',
//       sources: [],
//       createdAt: new Date().toISOString(),
//     };
//     setMessages((prev) => [...prev, assistantMsg]);

//     try {
//       const indexedSourceIds = sources
//         .filter((s) => s.status === 'indexed')
//         .map((s) => s.courseId);

//       const res = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: content,
//           sourceIds: indexedSourceIds,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({ error: 'Something went wrong' }));
//         throw new Error(errorData.error || 'Request failed');
//       }

//       // Extract sources from header and map to frontend shape
//       const sourcesHeader = res.headers.get('x-sources');
//       if (sourcesHeader) {
//         const rawSources = JSON.parse(sourcesHeader);
//         const parsedSources: SourceReference[] = rawSources.map((s: any) => ({
//           sourceId: s.lessonId,
//           name: s.lesson,
//           start: s.start,
//           end: s.end,
//         }));
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === assistantId ? { ...m, sources: parsedSources } : m
//           )
//         );
//       }

//       // Read the text stream chunk-by-chunk
//       const reader = res.body?.getReader();
//       const decoder = new TextDecoder();
//       if (!reader) throw new Error('No response body');

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value, { stream: true });

//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === assistantId ? { ...m, content: m.content + chunk } : m
//           )
//         );
//       }
//     } catch (err: any) {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === assistantId
//             ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
//             : m
//         )
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [sources]);

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
//         refreshSources,
//         deleteSource: async (id) => {
//           setSources((prev) => prev.filter((s) => s.id !== id));
//           if (previewSource?.id === id) setPreviewSource(null);

//           try {
//             await fetch(`/api/sources/${id}`, { method: 'DELETE' });
//             await refreshSources();
//           } catch (err) {
//             console.error('Delete failed:', err);
//             await refreshSources();
//           }
//         },
//         renameSource: async (id, name) => {
//           const res = await fetch(`/api/sources/${id}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name }),
//           });
//           if (!res.ok) throw new Error('Rename failed');
//           await refreshSources();
//         },
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
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Source, ChatMessage, SourceReference } from '@/types/source';
import { toast } from 'sonner';

interface AppContextType {
  sources: Source[];
  messages: ChatMessage[];
  previewSource: Source | null;
  previewStartTime: number | null;
  isAddModalOpen: boolean;
  isLoading: boolean;
  searchQuery: string;
  setPreviewSource: (source: Source | null) => void;
  setPreviewStartTime: (time: number | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  refreshSources: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (assistantMessageId: string) => Promise<void>;
  toggleSourceSelection: (id: string) => void;
  deleteSource: (id: string) => Promise<void>;
  renameSource: (id: string, name: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const [previewStartTime, setPreviewStartTime] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedIdsRef = useRef<Set<string>>(new Set());
  const prevSourcesRef = useRef<Source[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selected-source-ids');
      if (saved) selectedIdsRef.current = new Set(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const refreshSources = useCallback(async () => {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        const fetched: Source[] = Array.isArray(data.sources) ? data.sources : [];
        if (selectedIdsRef.current.size === 0) {
          fetched.forEach((s) => { if (s.status === 'indexed') selectedIdsRef.current.add(s.id); });
          localStorage.setItem('selected-source-ids', JSON.stringify([...selectedIdsRef.current]));
        }
        setSources(fetched.map((s) => ({ ...s, selected: selectedIdsRef.current.has(s.id) })));
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

  useEffect(() => {
    const prevSources = prevSourcesRef.current;
    let changed = false;
    const nextIds = new Set(selectedIdsRef.current);
    sources.forEach((source) => {
      const prev = prevSources.find((s) => s.id === source.id);
      if (source.status === 'indexed' && prev?.status !== 'indexed') {
        toast.success(`"${source.name}" indexed successfully`);
        if (!nextIds.has(source.id)) { nextIds.add(source.id); changed = true; }
      }
    });
    if (changed) {
      selectedIdsRef.current = nextIds;
      localStorage.setItem('selected-source-ids', JSON.stringify([...nextIds]));
      setSources((prev) => prev.map((s) => ({ ...s, selected: nextIds.has(s.id) })));
    }
    prevSourcesRef.current = sources;
  }, [sources]);

  const streamChat = useCallback(async (question: string, assistantId: string) => {
    try {
      const selectedIndexedIds = sources
        .filter((s) => s.status === 'indexed' && s.selected)
        .map((s) => s.courseId);

      if (selectedIndexedIds.length === 0) {
        toast.error('Select at least one source to chat');
        setMessages((prev) => prev.map((m) => m.id === assistantId
          ? { ...m, content: 'No sources selected. Please check at least one source in the sidebar.' }
          : m
        ));
        return;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sourceIds: selectedIndexedIds }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(errorData.error || 'Request failed');
      }

      // Parse sources from header
      const sourcesHeader = res.headers.get('x-sources');
      console.log('📎 x-sources header:', sourcesHeader);

      if (sourcesHeader && sourcesHeader !== '[]') {
        try {
          const rawSources = JSON.parse(sourcesHeader);
          const parsedSources: SourceReference[] = rawSources.map((s: any) => ({
            sourceId: s.lessonId,
            name: s.lesson,
            start: s.start,
            end: s.end,
          }));
          console.log('📎 Parsed sources:', parsedSources);
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, sources: parsedSources } : m));
        } catch (e) {
          console.error('Failed to parse x-sources header:', e);
        }
      } else {
        console.warn('⚠️ No sources in header');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
      }
    } catch (err: any) {
      toast.error('Failed to send message');
      setMessages((prev) => prev.map((m) => m.id === assistantId
        ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
        : m
      ));
    }
  }, [sources]);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', sources: [], createdAt: new Date().toISOString() }]);
    setIsLoading(true);

    await streamChat(content, assistantId);
    setIsLoading(false);
  }, [streamChat]);

  const regenerateMessage = useCallback(async (assistantMessageId: string) => {
    const assistantIndex = messages.findIndex((m) => m.id === assistantMessageId);
    if (assistantIndex === -1) return;
    let userIndex = -1;
    for (let i = assistantIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') { userIndex = i; break; }
    }
    if (userIndex === -1) return;

    const userContent = messages[userIndex].content;
    setMessages((prev) => prev.slice(0, assistantIndex));

    const newAssistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: newAssistantId, role: 'assistant', content: '', sources: [], createdAt: new Date().toISOString() }]);
    setIsLoading(true);

    await streamChat(userContent, newAssistantId);
    setIsLoading(false);
  }, [messages, streamChat]);

  const toggleSourceSelection = useCallback((id: string) => {
    const next = new Set(selectedIdsRef.current);
    next.has(id) ? next.delete(id) : next.add(id);
    selectedIdsRef.current = next;
    localStorage.setItem('selected-source-ids', JSON.stringify([...next]));
    setSources((prev) => prev.map((s) => s.id === id ? { ...s, selected: next.has(s.id) } : s));
  }, []);

  return (
    <AppContext.Provider
      value={{
        sources, messages, previewSource, previewStartTime, isAddModalOpen, isLoading, searchQuery,
        setPreviewSource, setPreviewStartTime, setIsAddModalOpen, setSearchQuery,
        sendMessage, regenerateMessage, toggleSourceSelection, refreshSources,
        deleteSource: async (id) => {
          const source = sources.find((s) => s.id === id);
          setSources((prev) => prev.filter((s) => s.id !== id));
          if (previewSource?.id === id) setPreviewSource(null);
          try {
            await fetch(`/api/sources/${id}`, { method: 'DELETE' });
            toast.success(`"${source?.name}" deleted`);
            await refreshSources();
          } catch (err) { toast.error('Failed to delete source'); await refreshSources(); }
        },
        renameSource: async (id, name) => {
          try {
            const res = await fetch(`/api/sources/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
            if (!res.ok) throw new Error('Rename failed');
            toast.success('Source renamed');
            await refreshSources();
          } catch (err) { toast.error('Failed to rename source'); throw err; }
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