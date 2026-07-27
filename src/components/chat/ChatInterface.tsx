// 'use client';
// // src/components/chat/ChatInterface.tsx

// import { useState, useRef, useEffect } from 'react';
// import { useApp } from '@/lib/context/AppContext';
// import { ChatMessage } from './ChatMessage';
// import { Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

// export function ChatInterface() {
//   const { messages, isLoading, sendMessage, sources } = useApp();
//   const [input, setInput] = useState('');
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const indexedCount = sources.filter((s) => s.status === 'indexed').length;

//   useEffect(() => {
//     scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
//   }, [messages, isLoading]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;
//     sendMessage(input.trim());
//     setInput('');
//   };

//   const suggestions = [
//     'Summarize my sources',
//     'What are the key takeaways?',
//     'Explain the main concepts',
//   ];

//   return (
//     <div className="flex h-full flex-col">
//       <div ref={scrollRef} className="flex-1 overflow-y-auto">
//         {messages.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
//               <Sparkles className="h-8 w-8 text-primary" />
//             </div>
//             <div className="text-center space-y-2">
//               <h2 className="text-2xl font-semibold tracking-tight">SourceMind LM</h2>
//               <p className="text-muted-foreground text-sm max-w-sm">
//                 {indexedCount > 0
//                   ? `${indexedCount} source${indexedCount > 1 ? 's' : ''} ready. Ask anything about them.`
//                   : 'Add sources from PDFs, YouTube, text, or web links. Then ask anything about them.'}
//               </p>
//             </div>
//             {indexedCount > 0 && (
//               <div className="flex flex-wrap justify-center gap-2 max-w-lg">
//                 {suggestions.map((q) => (
//                   <button
//                     key={q}
//                     onClick={() => sendMessage(q)}
//                     className="rounded-full border px-4 py-2 text-sm hover:bg-accent hover:border-primary/50 transition"
//                   >
//                     {q}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
//             {messages.map((msg) => (
//               <ChatMessage key={msg.id} message={msg} />
//             ))}
//                        {isLoading && (
//               <div className="flex items-center gap-3 text-muted-foreground pl-12">
//                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
//                   <Loader2 className="h-3 w-3 animate-spin" />
//                 </div>
//                 <span className="text-sm">Searching sources...</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="border-t bg-card/50 backdrop-blur-sm px-4 py-4">
//         <div className="mx-auto max-w-3xl">
//           {/* Active sources indicator */}
//           {indexedCount > 0 && (
//             <div className="flex items-center gap-1.5 mb-2 px-1">
//               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               <span className="text-[11px] text-muted-foreground">
//                 Searching {indexedCount} source{indexedCount > 1 ? 's' : ''}
//               </span>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="flex gap-3">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder={indexedCount > 0 
//                   ? "Ask anything about your sources..." 
//                   : "Add a source first to start chatting..."}
//                 disabled={indexedCount === 0}
//                 className="w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50"
//               />
//               <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
//             </div>
//             <button
//               type="submit"
//               disabled={!input.trim() || isLoading || indexedCount === 0}
//               className="rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:opacity-90 disabled:opacity-40 transition shrink-0"
//             >
//               <Send className="h-4 w-4" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ChatMessage } from './ChatMessage';
import { Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

export function ChatInterface() {
  const { messages, isLoading, sendMessage, sources } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedIndexedCount = sources.filter((s) => s.status === 'indexed' && s.selected).length;
  const totalIndexedCount = sources.filter((s) => s.status === 'indexed').length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const suggestions = [
    'Summarize my sources',
    'What are the key takeaways?',
    'Explain the main concepts',
  ];

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">SourceMind LM</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                {selectedIndexedCount > 0
                  ? `${selectedIndexedCount} source${selectedIndexedCount > 1 ? 's' : ''} selected. Ask anything about them.`
                  : totalIndexedCount > 0
                  ? 'Select at least one source from the sidebar to start chatting.'
                  : 'Add sources from PDFs, YouTube, text, or web links. Then ask anything about them.'}
              </p>
            </div>
            {selectedIndexedCount > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border px-4 py-2 text-sm hover:bg-accent hover:border-primary/50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-muted-foreground pl-12">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
                <span className="text-sm">Searching sources...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t bg-card/50 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto max-w-3xl">
          {/* Active sources indicator */}
          {selectedIndexedCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-muted-foreground">
                Searching {selectedIndexedCount} source{selectedIndexedCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedIndexedCount > 0
                    ? 'Ask anything about your sources...'
                    : totalIndexedCount > 0
                    ? 'Select a source to start chatting...'
                    : 'Add a source first to start chatting...'
                }
                disabled={selectedIndexedCount === 0}
                className="w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary transition disabled:opacity-50"
              />
              <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || selectedIndexedCount === 0}
              className="rounded-xl bg-primary px-4 py-3 text-primary-foreground hover:opacity-90 disabled:opacity-40 transition shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
