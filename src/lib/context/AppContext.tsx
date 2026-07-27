'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Source, ChatMessage, SourceReference } from '@/types/source';

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
        setSources(Array.isArray(data.sources) ? data.sources : []);
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

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      sources: [],
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Something went wrong' }));
        throw new Error(errorData.error || 'Request failed');
      }

      // Extract sources from header and map to frontend shape
      const sourcesHeader = res.headers.get('x-sources');
      if (sourcesHeader) {
        const rawSources = JSON.parse(sourcesHeader);
        const parsedSources: SourceReference[] = rawSources.map((s: any) => ({
          sourceId: s.lessonId,
          name: s.lesson,
          start: s.start,
          end: s.end,
        }));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, sources: parsedSources } : m
          )
        );
      }

      // Read the text stream chunk-by-chunk
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [sources]);

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
          setSources((prev) => prev.filter((s) => s.id !== id));
          if (previewSource?.id === id) setPreviewSource(null);

          try {
            await fetch(`/api/sources/${id}`, { method: 'DELETE' });
            await refreshSources();
          } catch (err) {
            console.error('Delete failed:', err);
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