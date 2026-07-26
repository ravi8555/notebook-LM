'use client';
// src/components/chat/ChatMessage.tsx

// import { ChatMessage as ChatMessageType } from '@/types/source';
// import { useApp } from '@/lib/context/AppContext';
// import { User, Bot, FileText, ExternalLink, Clock, Hash } from 'lucide-react';

// interface Props {
//   message: ChatMessageType;
// }

// export function ChatMessage({ message }: Props) {
//   const { setPreviewSource, sources } = useApp();
//   const isUser = message.role === 'user';

//   const handleSourceClick = (sourceId: string) => {
//     // backend sends lessonId = "lesson-<source.id>"
//     const id = sourceId.replace('lesson-', '');
//     const source = sources.find((s) => s.id === id);
//     if (source) setPreviewSource(source);
//   };

//   const getSourceMeta = (sourceId: string) => {
//     const id = sourceId.replace('lesson-', '');
//     return sources.find((s) => s.id === id);
//   };

//   return (
//     <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
//       <div
//         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
//           isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
//         }`}
//       >
//         {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//       </div>

//       <div className={`flex-1 space-y-3 ${isUser ? 'items-end' : ''}`}>
//         <div
//           className={`inline-block max-w-full rounded-2xl px-5 py-3 text-sm leading-relaxed ${
//             isUser
//               ? 'bg-primary text-primary-foreground rounded-tr-sm'
//               : 'bg-muted rounded-tl-sm'
//           }`}
//         >
//           {message.content}
//         </div>

//         {!isUser && message.sources && message.sources.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {message.sources.map((source) => {
//               const meta = getSourceMeta(source.sourceId);
//               const isVideo = meta?.type === 'youtube' || meta?.type === 'vtt' || meta?.type === 'srt';
              
//               return (
//                 <button
//                   key={`${source.sourceId}-${source.start}`}
//                   onClick={() => handleSourceClick(source.sourceId)}
//                   className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition hover:bg-accent hover:border-primary"
//                 >
//                   <FileText className="h-3 w-3" />
//                   <span className="truncate max-w-[140px]">{source.name}</span>

//                   {isVideo ? (
//     <>
//       <Clock className="h-3 w-3" />
//       {formatTime(source.start)} - {formatTime(source.end)}
//     </>
//   ) : (
//     <>
//       <Hash className="h-3 w-3" />
//       Chunk {Math.floor(source.start / 10) + 1}
//     </>
//   )}
                  
//                   {/* {isVideo ? (
//                     <span className="text-muted-foreground flex items-center gap-0.5">
//                       <Clock className="h-3 w-3" />
//                       {formatTime(source.start)} - {formatTime(source.end)}
//                     </span>
//                   ) : (
//                     <span className="text-muted-foreground flex items-center gap-0.5">
//                       <Hash className="h-3 w-3" />
//                       {Math.floor(source.start / 10) + 1}
//                     </span>
//                   )} */}
                  
//                   <ExternalLink className="h-3 w-3 text-muted-foreground" />
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function formatTime(seconds: number): string {
//   const m = Math.floor(seconds / 60);
//   const s = Math.floor(seconds % 60);
//   return `${m}:${String(s).padStart(2, '0')}`;
// }

'use client';

import { ChatMessage as ChatMessageType } from '@/types/source';
import { useApp } from '@/lib/context/AppContext';
import { User, Bot, FileText, Youtube, Type, Link2, Subtitles, Clock, Hash, ExternalLink } from 'lucide-react';

interface Props {
  message: ChatMessageType;
}

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  youtube: Youtube,
  text: Type,
  vtt: Subtitles,
  weblink: Link2,
};

export function ChatMessage({ message }: Props) {
  const { setPreviewSource, sources } = useApp();
  const isUser = message.role === 'user';

  const handleSourceClick = (sourceId: string) => {
    const id = sourceId.replace('lesson-', '');
    const source = sources.find((s) => s.id === id);
    if (source) setPreviewSource(source);
  };

  const getSourceMeta = (sourceId: string) => {
    const id = sourceId.replace('lesson-', '');
    return sources.find((s) => s.id === id);
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex-1 space-y-3 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed text-left ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source) => {
              const meta = getSourceMeta(source.sourceId);
              const isVideo = meta?.type === 'youtube' || meta?.type === 'vtt';
              const SourceIcon = meta?.type ? typeIcons[meta.type] || FileText : FileText;

              return (
                <button
                  key={`${source.sourceId}-${source.start}`}
                  onClick={() => handleSourceClick(source.sourceId)}
                  className="group inline-flex items-center gap-1.5 rounded-full border bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium transition hover:bg-accent hover:border-primary hover:shadow-sm"
                >
                  <SourceIcon className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                  <span className="max-w-[120px] truncate">{source.name}</span>
                  
                  {isVideo ? (
                    <span className="text-muted-foreground flex items-center gap-0.5 tabular-nums">
                      <Clock className="h-3 w-3" />
                      {formatTime(source.start)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-0.5 tabular-nums">
                      <Hash className="h-3 w-3" />
                      {Math.floor(source.start / 10) + 1}
                    </span>
                  )}
                  
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}