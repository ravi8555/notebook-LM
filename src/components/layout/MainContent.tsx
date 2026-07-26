// // components/layout/MainContent.tsx

// export function MainContent() {
//   return (
//     <main
//       className="
//         flex-1
//         bg-background
//         p-8
//       "
//     >
//       <div
//         className="
//           flex
//           h-full
//           items-center
//           justify-center
//           rounded-xl
//           border
//           border-dashed
//         "
//       >
//         <p className="text-muted-foreground text-lg">
//           Welcome to NotebookLM Clone
//         </p>
//       </div>
//     </main>
//   );
// }
import { ChatInterface } from '../chat/ChatInterface';

export function MainContent() {
  return (
    <main className="flex-1 bg-background overflow-hidden">
      <ChatInterface />
    </main>
  );
}