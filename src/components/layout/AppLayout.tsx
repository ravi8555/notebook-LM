'use client';

// import { Navbar } from './Navbar';
// import { Sidebar } from './Sidebar';
// import { MainContent } from './MainContent';
// import { SourcePreview } from '../sources/SourcePreview';
// import { AddSourceModal } from '../sources/AddSourceModal';
// import { useApp } from '@/lib/context/AppContext';

// export function AppLayout() {
//   const { previewSource, isAddModalOpen } = useApp();

//   return (
//     <div className="flex h-screen flex-col bg-background">
//       <Navbar />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />

//         <MainContent />

//         {previewSource && <SourcePreview />}
//       </div>

//       {isAddModalOpen && <AddSourceModal />}
//     </div>
//   );
// }



import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { SourcePreview } from '../sources/SourcePreview';
import { AddSourceModal } from '../sources/AddSourceModal';
import { useApp } from '@/lib/context/AppContext';

export function AppLayout() {
  const { previewSource, isAddModalOpen, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop */}
{sidebarOpen && (
  <div
     className="fixed inset-0 z-40 bg-black/50 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

        <Sidebar />
        <MainContent />

        {previewSource && <SourcePreview />}
      </div>

      {isAddModalOpen && <AddSourceModal />}
    </div>
  );
}