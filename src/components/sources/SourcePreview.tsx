// 'use client';

// import { useApp } from '@/lib/context/AppContext';
// import { X, FileText, Youtube, Type, Link2, Subtitles } from 'lucide-react';
// import { useState, useEffect } from 'react';

// const typeIcons = {
//   pdf: FileText,
//   youtube: Youtube,
//   text: Type,
//   vtt: Subtitles,
//   weblink: Link2,
// };

// export function SourcePreview() {
//   const { previewSource, setPreviewSource } = useApp();
//   const [textContent, setTextContent] = useState<string>('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!previewSource) return;
    
//     // Fetch text content for subtitle/text sources
//     if (['vtt', 'text', 'weblink'].includes(previewSource.type)) {
//       setLoading(true);
//       fetch(`/api/sources/${previewSource.id}/file`)
//         .then(r => r.ok ? r.text() : 'Failed to load content')
//         .then(text => setTextContent(text))
//         .catch(() => setTextContent('Failed to load content'))
//         .finally(() => setLoading(false));
//     }
//   }, [previewSource]);

//   if (!previewSource) return null;

//   const Icon = typeIcons[previewSource.type];

//   return (
//     <aside className="w-[420px] border-l bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
//       <div className="flex items-center justify-between border-b px-4 py-3">
//         <div className="flex items-center gap-2 min-w-0">
//           <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
//           <span className="font-medium text-sm truncate">{previewSource.name}</span>
//         </div>
//         <button
//           onClick={() => setPreviewSource(null)}
//           className="rounded-lg p-1.5 hover:bg-accent shrink-0"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         {loading && (
//           <div className="text-sm text-muted-foreground">Loading transcript...</div>
//         )}

//         {previewSource.type === 'pdf' && (
//           <div className="h-full">
//             <iframe
//               src={`/api/sources/${previewSource.id}/file`}
//               className="w-full h-full rounded-lg border"
//               title={previewSource.name}
//             />
//           </div>
//         )}

//         {previewSource.type === 'youtube' && previewSource.url && (
//           <div className="space-y-4">
//             <div className="aspect-video rounded-lg overflow-hidden border bg-black">
//               <iframe
//                 width="100%"
//                 height="100%"
//                 src={`https://www.youtube.com/embed/${extractVideoId(previewSource.url)}`}
//                 title="YouTube video player"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//             <a
//               href={previewSource.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-primary hover:underline flex items-center gap-1"
//             >
//               Open on YouTube <Link2 className="h-3 w-3" />
//             </a>
//           </div>
//         )}

//         {(previewSource.type === 'text' || previewSource.type === 'weblink') && (
//           <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted rounded-lg p-4">
//             {textContent || previewSource.content || 'No content available.'}
//           </div>
//         )}

//         {previewSource.type === 'vtt' && (
//           <div className="space-y-2">
//             <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
//               Transcript
//             </div>
//             <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-muted rounded-lg p-4 font-mono text-xs overflow-auto">
//               {textContent || 'No transcript available.'}
//             </pre>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// function extractVideoId(url: string): string {
//   const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
//   return match?.[1] || '';
// }

'use client';

import { useApp } from '@/lib/context/AppContext';
import { X, FileText, Youtube, Type, Link2, Subtitles, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  youtube: Youtube,
  text: Type,
  vtt: Subtitles,
  weblink: Link2,
};

const typeLabels: Record<string, string> = {
  pdf: 'PDF Document',
  youtube: 'YouTube Video',
  text: 'Text Note',
  vtt: 'Subtitle File',
  weblink: 'Web Article',
};

export function SourcePreview() {
  const { previewSource, setPreviewSource, previewStartTime, setPreviewStartTime } = useApp();
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!previewSource) return;
    setTextContent('');
    setError('');

    if (['text', 'weblink', 'vtt'].includes(previewSource.type)) {
      setLoading(true);
      fetch(`/api/sources/${previewSource.id}/file`)
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load');
          return r.text();
        })
        .then((text) => setTextContent(text))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [previewSource]);

  if (!previewSource) return null;

  const Icon = typeIcons[previewSource.type] || FileText;
  const label = typeLabels[previewSource.type] || 'Source';

  const handleClose = () => {
    setPreviewSource(null);
    setPreviewStartTime(null);
  };

  return (
    <aside className="w-[480px] border-l bg-card flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{previewSource.name}</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="rounded-lg p-1.5 hover:bg-accent transition shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading content...</span>
          </div>
        )}

        {error && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="text-sm font-medium text-destructive">Failed to load content</div>
            <div className="text-xs">{error}</div>
          </div>
        )}

        {!loading && !error && previewSource.type === 'pdf' && (
          <iframe
            src={`/api/sources/${previewSource.id}/file`}
            className="w-full h-full bg-white"
            title={previewSource.name}
          />
        )}

        {!loading && !error && previewSource.type === 'youtube' && previewSource.url && (
          <div className="flex h-full flex-col">
            <div className="aspect-video bg-black shrink-0">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractVideoId(previewSource.url)}${
                  previewStartTime ? `?start=${Math.floor(previewStartTime)}` : ''
                }`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <a
                href={`${previewSource.url}${previewStartTime ? `?t=${Math.floor(previewStartTime)}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Open on YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {!loading && !error && (previewSource.type === 'text' || previewSource.type === 'weblink') && (
          <div className="h-full overflow-y-auto p-5">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {textContent || previewSource.content || 'No content available.'}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && previewSource.type === 'vtt' && (
          <div className="h-full overflow-y-auto p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
              Transcript
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-xs text-foreground/80">
              {textContent || 'No transcript available.'}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
}

function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  return match?.[1] || '';
}