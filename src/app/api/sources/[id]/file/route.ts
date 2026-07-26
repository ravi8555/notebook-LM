// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const uploadDir = path.join(process.cwd(), 'data', 'sources', 'uploads');
  
//   // Try original file extensions
//   const extensions = ['.pdf', '.txt', '.vtt', '.srt'];
  
//   for (const ext of extensions) {
//     const filePath = path.join(uploadDir, `${params.id}${ext}`);
//     try {
//       const file = await fs.readFile(filePath);
      
//       const contentType = 
//         ext === '.pdf' ? 'application/pdf' :
//         ext === '.txt' ? 'text/plain' :
//         ext === '.vtt' ? 'text/vtt' :
//         'application/octet-stream';
      
//       return new NextResponse(file, {
//         headers: { 
//           'Content-Type': contentType,
//           'Content-Disposition': `inline; filename="${params.id}${ext}"`,
//         },
//       });
//     } catch {
//       continue;
//     }
//   }
  
//   return NextResponse.json({ error: 'File not found' }, { status: 404 });
// }

import { NextResponse } from 'next/server';
import { sourceService } from '@/services/sourceServiceSingleton';
import fs from 'fs/promises';
import path from 'path'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const source = sourceService.getById(params.id);
  
  const uploadDir = path.join(process.cwd(), 'data', 'sources', 'uploads');
  const extensions = ['.pdf', '.txt', '.vtt', '.srt'];
  
  for (const ext of extensions) {
    const filePath = path.join(uploadDir, `${params.id}${ext}`);
    try {
      const file = await fs.readFile(filePath);
      const contentType = 
        ext === '.pdf' ? 'application/pdf' :
        ext === '.txt' ? 'text/plain; charset=utf-8' :
        'text/plain; charset=utf-8';
      
      return new NextResponse(file, {
        headers: { 
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${params.id}${ext}"`,
        },
      });
    } catch { continue; }
  }
  
  return NextResponse.json({ error: 'File not found' }, { status: 404 });
}