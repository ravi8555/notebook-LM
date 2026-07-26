// 'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { SourceType } from '@/types/source';
import { FileText, Youtube, Type, Subtitles, Link2, X, Upload } from 'lucide-react';


const sourceTypes: { type: SourceType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'pdf', label: 'PDF', icon: FileText, desc: 'Upload a PDF document' },
  { type: 'youtube', label: 'YT Link', icon: Youtube, desc: 'Paste a YouTube URL' },
  { type: 'text', label: 'Text', icon: Type, desc: 'Paste or type text' },
  { type: 'vtt', label: 'VTT', icon: Subtitles, desc: 'Upload a subtitle file' },
  { type: 'weblink', label: 'Web Link', icon: Link2, desc: 'Paste a website URL' },
];

export function AddSourceModal() {
  const { setIsAddModalOpen, refreshSources } = useApp();
  const [selectedType, setSelectedType] = useState<SourceType | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('name', name || 'Untitled');
    formData.append('type', selectedType);
    if (content) formData.append('content', content);
    if (url) formData.append('url', url);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      await refreshSources();
      setIsAddModalOpen(false);
      setSelectedType(null);
      setName('');
      setContent('');
      setUrl('');
      setFile(null);
    } catch (err) {
      alert('Failed to add source. Check console.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Source</h2>
          <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-2 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!selectedType ? (
          <div className="grid grid-cols-3 gap-4">
            {sourceTypes.map(({ type, label, icon: Icon, desc }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="flex flex-col items-center gap-3 rounded-xl border p-6 transition hover:bg-accent hover:border-primary"
              >
                <Icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Source Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., React Documentation"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {selectedType === 'pdf' && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">{file ? file.name : 'Click to upload PDF'}</span>
                </label>
              </div>
            )}

            {selectedType === 'vtt' && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".vtt,.srt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="vtt-upload"
                />
                <label htmlFor="vtt-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">{file ? file.name : 'Click to upload VTT/SRT'}</span>
                </label>
              </div>
            )}

            {(selectedType === 'youtube' || selectedType === 'weblink') && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={selectedType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com'}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}

            {selectedType === 'text' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste or type your text here..."
                  rows={8}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Add Source'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}