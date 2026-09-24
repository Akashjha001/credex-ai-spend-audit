'use client';
import { useState } from 'react';
export default function LeadForm({ auditId, teamSize }: { auditId: string; teamSize: number }) {
  const [sent, setSent] = useState(false);
  async function submit(formData: FormData) {
    await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ auditId, teamSize, email: formData.get('email'), company: formData.get('company'), role: formData.get('role'), website: formData.get('website') }) });
    setSent(true);
  }
  if (sent) return <div className="rounded-3xl bg-white p-6 text-slate-950"><b>Report captured.</b> Check your inbox for the confirmation.</div>;
  return <form action={submit} className="rounded-3xl bg-white p-6 text-slate-950">
    <h2 className="text-2xl font-bold">Email me this report</h2>
    <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
    <div className="mt-4 grid gap-3 md:grid-cols-3"><input required name="email" type="email" placeholder="Work email" className="rounded-xl border p-3"/><input name="company" placeholder="Company" className="rounded-xl border p-3"/><input name="role" placeholder="Role" className="rounded-xl border p-3"/></div>
    <button className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Send report</button>
  </form>;
}
