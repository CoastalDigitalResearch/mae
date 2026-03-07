import { NextResponse } from 'next/server';
import { saveConfig, loadConfig } from '@/lib/config';
import type { ProviderConfig } from '@/lib/providers/types';

export async function GET() {
  const config = loadConfig();
  return NextResponse.json({ configured: config !== null, config });
}

export async function POST(req: Request) {
  const body: ProviderConfig = await req.json();

  if (!body.provider || !body.model) {
    return NextResponse.json({ error: 'provider and model are required' }, { status: 400 });
  }

  saveConfig(body);
  return NextResponse.json({ ok: true });
}
