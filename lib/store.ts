import { createClient } from '@supabase/supabase-js';
import type { AuditResult } from '@/audit/types';

const memory = new Map<string, AuditResult>();

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function saveAudit(result: AuditResult) {
  memory.set(result.id, result);
  const db = supabase();
  if (!db) return;
  await db.from('audits').upsert({ id: result.id, public_payload: result, created_at: result.createdAt });
}

export async function getAudit(id: string): Promise<AuditResult | null> {
  if (memory.has(id)) return memory.get(id)!;
  const db = supabase();
  if (!db) return null;
  const { data } = await db.from('audits').select('public_payload').eq('id', id).single();
  return (data?.public_payload as AuditResult) ?? null;
}

export async function saveLead(input: { auditId: string; email: string; company?: string; role?: string; teamSize?: number }) {
  const db = supabase();
  if (!db) return;
  await db.from('leads').insert({ audit_id: input.auditId, email: input.email, company: input.company, role: input.role, team_size: input.teamSize });
}
