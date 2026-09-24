import { Resend } from 'resend';

export async function sendAuditEmail(input: { email: string; auditId: string; monthlySavings: number }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const resend = new Resend(key);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'Credex Audit <audit@example.com>',
    to: input.email,
    subject: 'Your AI Spend Audit report',
    text: `Your audit is ready: ${site}/audit/${input.auditId}\nPotential monthly savings: $${input.monthlySavings}. ${input.monthlySavings > 500 ? 'Credex may be able to help capture more of this saving through discounted credits.' : 'We will notify you when new optimizations apply to your stack.'}`
  });
  return { skipped: false };
}
