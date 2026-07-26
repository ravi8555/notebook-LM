'use client';

import { AddSourceButton } from '../sources/AddSourceButton';
import { SourceList } from '../sources/SourceList';
import { useApp } from '@/lib/context/AppContext';

export function Sidebar() {
  const { setIsAddModalOpen, sources } = useApp();

  return (
    <aside className="w-72 border-r bg-card flex flex-col shrink-0">
      <div className="p-4 border-b">
        <AddSourceButton onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SourceList />
      </div>

      <div className="p-4 border-t text-xs text-muted-foreground">
        {sources.length} source(s)
      </div>
    </aside>
  );
}