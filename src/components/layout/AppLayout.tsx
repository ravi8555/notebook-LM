// src/component/layout/AppLayout.tsx

// import { Navbar } from "./Navbar";
// import { Sidebar } from "./Sidebar";
// import { MainContent } from "./MainContent";

// export function AppLayout() {
//   return (
//     <div className="flex h-screen flex-col bg-background">
//       <Navbar />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />

//         <MainContent />
//       </div>
//     </div>
//   );
// }


'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { SourcePreview } from '../sources/SourcePreview';
import { AddSourceModal } from '../sources/AddSourceModal';
import { useApp } from '@/lib/context/AppContext';

export function AppLayout() {
  const { previewSource, isAddModalOpen } = useApp();

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <MainContent />

        {previewSource && <SourcePreview />}
      </div>

      {isAddModalOpen && <AddSourceModal />}
    </div>
  );
}