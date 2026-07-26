// import { ArrowLeft, ArrowRight } from "lucide-react";

// export function Navbar() {
//   return (
//     <header className="flex h-16 items-center border-b px-6">
//       <ArrowLeft className="mr-3 h-5 w-5" />

//       <ArrowRight className="mr-6 h-5 w-5" />

//       <div className="h-10 flex-1 rounded-full border bg-background" />
//     </header>
//   );
// }
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export function Navbar() {
  return (
    <header className="flex h-14 items-center border-b px-4 bg-card shrink-0">
      <ArrowLeft className="mr-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
      <ArrowRight className="mr-6 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />

      <div className="flex items-center gap-2 flex-1">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="font-semibold text-lg tracking-tight">SourceMind LM</span>
      </div>

      <div className="h-9 flex-1 max-w-xl rounded-full border bg-background px-4 flex items-center text-sm text-muted-foreground">
        Search sources...
      </div>

      <div className="flex-1" />
    </header>
  );
}