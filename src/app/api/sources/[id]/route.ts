import { NextRequest, NextResponse } from 'next/server';
import { sourceService } from '@/services/sourceServiceSingleton';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await sourceService.deleteSource(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === 'Source not found') {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) throw new Error('Name is required');
    await sourceService.renameSource(params.id, name.trim());
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}