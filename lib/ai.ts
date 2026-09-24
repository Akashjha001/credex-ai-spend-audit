import { fallbackSummary } from '@/audit/engine';
import type { AuditResult } from '@/audit/types';

export async function generateSummary(result: AuditResult): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return fallbackSummary(result);
  try {
    const prompt = `Write a concise ~100-word executive summary for this AI spend audit. Be specific, honest, and finance-literate. Do not invent savings. Data: ${JSON.stringify({ totalMonthlySavings: result.totalMonthlySavings, totalAnnualSavings: result.totalAnnualSavings, recommendations: result.recommendations.map(r => ({ tool: r.item.tool, plan: r.item.plan, action: r.recommendedAction, savings: r.monthlySavings, reason: r.reason })) })}`;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-3-5-haiku-latest', max_tokens: 180, messages: [{ role: 'user', content: prompt }] })
    });
    if (!res.ok) return fallbackSummary(result);
    const data = await res.json();
    return data?.content?.[0]?.text ?? fallbackSummary(result);
  } catch {
    return fallbackSummary(result);
  }
}
