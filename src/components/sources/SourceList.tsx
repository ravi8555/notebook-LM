'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Source, SourceStatus } from '@/types/source';
import { FileText, Youtube, Link2, Type, Subtitles, Pencil, Trash2, Loader2, Check, X, AlertCircle } from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  youtube: Youtube,
  text: Type,
  vtt: Subtitles,
  weblink: Link2,
};

function StatusDot({ status }: { status: SourceStatus }) {
  const colors = {
    pending: 'bg-gray-400',
    indexing: 'bg-amber-500 animate-pulse',
    indexed: 'bg-emerald-500',
    error: 'bg-red-500',
  };
  return <span className={`h-2 w-2 rounded-full shrink-0 ${colors[status]}`} />;
}

export function SourceList() {
  const { sources, setPreviewSource, deleteSource, renameSource } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
   const [deletingId, setDeletingId] = useState<string | null>(null);

  const startRename = (source: Source) => {
    setEditingId(source.id);
    setEditName(source.name);
  };

  const saveRename = async (id: string) => {
    if (!editName.trim()) return;
    await renameSource(id, editName.trim());
    setEditingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await deleteSource(id);
    setDeletingId(null);
  };


  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center px-2 text-muted-foreground">
        <FileText className="h-8 w-8 opacity-30" />
        <div className="text-sm">
          No sources yet.<br />Click "Add Source" to get started.
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-1">
      {sources.map((source) => {
         const Icon = typeIcons[source.type] || FileText;
        const isEditing = editingId === source.id;
        const isDeleting = deletingId === source.id;

         return (
          <div
            key={source.id}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              isDeleting ? 'opacity-40' : 'hover:bg-accent'
            }`}
          >
            <button
              onClick={() => !isEditing && setPreviewSource(source)}
              disabled={isDeleting}
              className="flex flex-1 items-center gap-2.5 min-w-0 text-left disabled:cursor-not-allowed"
            >
              <StatusDot status={source.status} />
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              
              {isEditing ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename(source.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onBlur={() => saveRename(source.id)}
                  className="flex-1 min-w-0 bg-background border rounded px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <span className="flex-1 truncate font-medium">{source.name}</span>
              )}
            </button>

            {!isEditing && !isDeleting && source.status !== 'indexing' && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); startRename(source); }}
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
                  title="Rename"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(source.id, source.name); }}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}

            {isDeleting && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground shrink-0" />
            )}

            {source.status === 'indexing' && !isDeleting && (
              <span className="text-[10px] text-amber-500 font-medium shrink-0">Indexing</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

