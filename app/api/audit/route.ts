import { NextResponse } from 'next/server';
import { runAudit } from '@/audit/engine';
import { generateSummary } from '@/lib/ai';
import { saveAudit } from '@/lib/store';

export async function POST(request: Request) {
  const input = await request.json();
  const result = runAudit(input);
  result.summary = await generateSummary(result);
  await saveAudit(result);
  return NextResponse.json({ id: result.id, result });
}
