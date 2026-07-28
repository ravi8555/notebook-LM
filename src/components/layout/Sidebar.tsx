'use client';

// import { AddSourceButton } from '../sources/AddSourceButton';
// import { SourceList } from '../sources/SourceList';
// import { useApp } from '@/lib/context/AppContext';

// export function Sidebar() {
//   const { setIsAddModalOpen, sources } = useApp();

//   return (
//     <aside className="w-72 border-r bg-card flex flex-col shrink-0">
//       <div className="p-4 border-b">
//         <AddSourceButton onClick={() => setIsAddModalOpen(true)} />
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         <SourceList />
//       </div>

//       <div className="p-4 border-t text-xs text-muted-foreground">
//         {sources.length} source(s)
//       </div>
//     </aside>
//   );
// }
'use client';

import { AddSourceButton } from '../sources/AddSourceButton';
import { SourceList } from '../sources/SourceList';
import { useApp } from '@/lib/context/AppContext';
import { X } from 'lucide-react';

export function Sidebar() {
  const { setIsAddModalOpen, sources, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <aside
      className={`
        fixed lg:relative inset-y-0 left-0 z-[60] w-72 border-r bg-card flex flex-col shrink-0
        transform transition-transform duration-200 ease-in-out shadow-2xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="p-4 border-b flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <AddSourceButton onClick={() => setIsAddModalOpen(true)} />
        </div>
        <button
  onClick={() => setSidebarOpen(false)}
  className="lg:hidden p-1.5 rounded-lg hover:bg-accent shrink-0 text-muted-foreground"
  aria-label="Close sidebar"
>
  <X className="h-5 w-5" />
</button>
        
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