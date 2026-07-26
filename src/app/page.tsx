import { AppLayout } from '@/components/layout/AppLayout';
import { AppProvider } from '@/lib/context/AppContext';

export default function HomePage() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}