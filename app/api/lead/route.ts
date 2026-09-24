import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendAuditEmail } from '@/lib/email';
import { getAudit, saveLead } from '@/lib/store';

const schema = z.object({ auditId: z.string(), email: z.string().email(), company: z.string().optional(), role: z.string().optional(), teamSize: z.number().optional(), website: z.string().optional() });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  if (payload.website) return NextResponse.json({ ok: true });
  const audit = await getAudit(payload.auditId);
  await saveLead(payload);
  if (audit) await sendAuditEmail({ email: payload.email, auditId: payload.auditId, monthlySavings: audit.totalMonthlySavings });
  return NextResponse.json({ ok: true });
}
