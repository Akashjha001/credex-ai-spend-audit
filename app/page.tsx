'use client';
import { useEffect, useMemo, useState } from 'react';
import { pricing, type ToolKey } from '@/audit/pricing';
import type { AuditInput, SpendItem, UseCase } from '@/audit/types';

const toolLabels: Record<ToolKey, string> = {
  cursor: 'Cursor', copilot: 'GitHub Copilot', claude: 'Claude', chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API direct', openai_api: 'OpenAI API direct', gemini: 'Gemini', v0: 'v0'
};

const defaultInput: AuditInput = {
  teamSize: 5,
  useCase: 'coding',
  tools: [
    { id: '1', tool: 'cursor', plan: 'Business', monthlySpend: 200, seats: 5 },
    { id: '2', tool: 'chatgpt', plan: 'Team', monthlySpend: 150, seats: 5 }
  ]
};

export default function Home() {
  const [input, setInput] = useState<AuditInput>(defaultInput);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('credex-audit-input');
    if (saved) setInput(JSON.parse(saved));
  }, []);
  useEffect(() => localStorage.setItem('credex-audit-input', JSON.stringify(input)), [input]);

  const total = useMemo(() => input.tools.reduce((sum, t) => sum + Number(t.monthlySpend || 0), 0), [input]);

  function updateTool(id: string, patch: Partial<SpendItem>) {
    setInput((old) => ({ ...old, tools: old.tools.map((t) => t.id === id ? { ...t, ...patch } : t) }));
  }

  async function submit() {
    setLoading(true);
    const res = await fetch('/api/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
    const data = await res.json();
    window.location.href = `/audit/${data.id}`;
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e40af,transparent_35%),#020617]">
    <section className="mx-auto max-w-6xl px-6 py-12">
      <nav className="flex justify-between text-sm text-slate-300"><span className="font-semibold text-white">Credex Audit Lab</span><span>No login. Value before email.</span></nav>
      <div className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-blue-400/40 px-3 py-1 text-sm text-blue-100">Free AI spend audit</p>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Find wasted AI spend fast.</h1>
          <p className="text-xl text-slate-300">Paste your AI stack, plans, seats, and spend. Get an instant audit with practical savings and a shareable report.</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 p-4"><b className="text-2xl">8</b><p className="text-xs text-slate-300">tools covered</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><b className="text-2xl">0</b><p className="text-xs text-slate-300">login required</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><b className="text-2xl">1</b><p className="text-xs text-slate-300">public URL</p></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold">Your stack</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">${total}/mo</span></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Team size<input className="mt-1 w-full rounded-xl border p-3" type="number" value={input.teamSize} onChange={(e) => setInput({ ...input, teamSize: Number(e.target.value) })}/></label>
            <label className="text-sm font-medium">Primary use case<select className="mt-1 w-full rounded-xl border p-3" value={input.useCase} onChange={(e) => setInput({ ...input, useCase: e.target.value as UseCase })}>{['coding','writing','data','research','mixed'].map(x => <option key={x}>{x}</option>)}</select></label>
          </div>
          <div className="mt-5 space-y-3">
            {input.tools.map((item) => <div className="grid gap-2 rounded-2xl border bg-slate-50 p-3 md:grid-cols-4" key={item.id}>
              <select className="rounded-xl border p-2" value={item.tool} onChange={(e) => updateTool(item.id, { tool: e.target.value as ToolKey, plan: pricing[e.target.value as ToolKey][0].plan })}>{Object.entries(toolLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
              <select className="rounded-xl border p-2" value={item.plan} onChange={(e) => updateTool(item.id, { plan: e.target.value })}>{pricing[item.tool].map(p => <option key={p.plan}>{p.plan}</option>)}</select>
              <input className="rounded-xl border p-2" type="number" aria-label="Monthly spend" value={item.monthlySpend} onChange={(e) => updateTool(item.id, { monthlySpend: Number(e.target.value) })}/>
              <input className="rounded-xl border p-2" type="number" aria-label="Seats" value={item.seats} onChange={(e) => updateTool(item.id, { seats: Number(e.target.value) })}/>
            </div>)}
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-xl border px-4 py-3 font-semibold" onClick={() => setInput({ ...input, tools: [...input.tools, { id: crypto.randomUUID(), tool: 'claude', plan: 'Pro', monthlySpend: 20, seats: 1 }] })}>Add tool</button>
            <button className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white" onClick={submit} disabled={loading}>{loading ? 'Auditing...' : 'Run free audit'}</button>
          </div>
        </div>
      </div>
    </section>
  </main>;
}
