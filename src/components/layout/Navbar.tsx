// import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

// export function Navbar() {
//   return (
//     <header className="flex h-14 items-center border-b px-4 bg-card shrink-0">
//       <ArrowLeft className="mr-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
//       <ArrowRight className="mr-6 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />

//       <div className="flex items-center gap-2 flex-1">
//         <BookOpen className="h-5 w-5 text-primary" />
//         <span className="font-semibold text-lg tracking-tight">SourceMind LM</span>
//       </div>

//       <div className="h-9 flex-1 max-w-xl rounded-full border bg-background px-4 flex items-center text-sm text-muted-foreground">
//         Search sources...
//       </div>

//       <div className="flex-1" />
//     </header>
//   );
// }

import { ArrowLeft, ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export function Navbar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <header className="flex h-14 items-center border-b px-4 bg-card shrink-0 gap-3">
      <ArrowLeft className="mr-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
      <ArrowRight className="mr-6 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />

      <div className="flex items-center gap-2 flex-1">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="font-semibold text-lg tracking-tight">SourceMind LM</span>
      </div>

      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sources..."
          className="w-full h-9 rounded-full border bg-background pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1" />
    </header>
  );
}