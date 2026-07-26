import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export function AddSourceButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm font-medium transition hover:bg-accent hover:border-solid"
    >
      <Plus className="h-4 w-4" />
      Add Source
    </button>
  );
}