'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { SourceType } from '@/types/source';
import { FileText, Youtube, Type, Subtitles, Link2, X, Upload, AlertCircle } from 'lucide-react';


const sourceTypes: { type: SourceType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'pdf', label: 'PDF', icon: FileText, desc: 'Upload a PDF document' },
  { type: 'youtube', label: 'YT Link', icon: Youtube, desc: 'Paste a YouTube URL' },
  { type: 'text', label: 'Text', icon: Type, desc: 'Paste or type text' },
  { type: 'vtt', label: 'VTT', icon: Subtitles, desc: 'Upload a subtitle file' },
  { type: 'weblink', label: 'Web Link', icon: Link2, desc: 'Paste a website URL' },
];

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}
export function AddSourceModal() {
  const { setIsAddModalOpen, refreshSources } = useApp();
  const [selectedType, setSelectedType] = useState<SourceType | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlError, setUrlError] = useState('');

  const validateUrl = (value: string, type: SourceType): string => {
    if (!value.trim()) return 'URL is required';
    
    try {
      new URL(value);
    } catch {
      return 'Please enter a valid URL';
    }

    if (type === 'youtube') {
      if (!isYouTubeUrl(value)) {
        return 'Please enter a valid YouTube URL (e.g., youtube.com/watch?v=... or youtu.be/...)';
      }
      const id = extractYouTubeId(value);
      if (!id || id.length !== 11) {
        return 'Could not extract YouTube video ID from this URL';
      }
    }

    if (type === 'weblink' && isYouTubeUrl(value)) {
      return 'This looks like a YouTube link. Please use "YT Link" instead for better results.';
    }

    return '';
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (selectedType) {
      setUrlError(validateUrl(value, selectedType));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    // Final validation
    if ((selectedType === 'youtube' || selectedType === 'weblink') && url) {
      const error = validateUrl(url, selectedType);
      if (error) {
        setUrlError(error);
        return;
      }
    }

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
      setUrlError('');
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
                <label className="text-sm font-medium mb-1.5 block">
                  {selectedType === 'youtube' ? 'YouTube URL' : 'Website URL'}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={
                    selectedType === 'youtube'
                      ? 'https://youtube.com/watch?v=...'
                      : 'https://example.com/article'
                  }
                  className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${
                    urlError ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {urlError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    {urlError}
                  </div>
                )}
                {selectedType === 'youtube' && !urlError && url && (
                  <div className="mt-1.5 text-xs text-emerald-500">
                    ✓ Valid YouTube video ID: {extractYouTubeId(url)}
                  </div>
                )}
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
                onClick={() => { setSelectedType(null); setUrlError(''); }}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isUploading || !!urlError}
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