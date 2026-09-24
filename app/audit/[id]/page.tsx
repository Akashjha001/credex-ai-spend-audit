import { getAudit } from '@/lib/store';
import LeadForm from './lead-form';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  const title = audit ? `$${audit.totalMonthlySavings}/mo AI savings found` : 'AI Spend Audit';
  return { title, openGraph: { title, description: 'See the public AI spend audit result.' }, twitter: { card: 'summary_large_image', title } };
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return <main className="p-10"><h1 className="text-3xl font-bold">Audit not found</h1></main>;
  const high = audit.totalMonthlySavings > 500;
  return <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
    <section className="mx-auto max-w-5xl space-y-6">
      <a className="text-sm text-blue-300" href="/">← Run another audit</a>
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl">
        <p className="text-blue-100">Public AI spend audit</p>
        <h1 className="mt-2 text-5xl font-bold">${audit.totalMonthlySavings}/mo savings</h1>
        <p className="mt-2 text-xl text-blue-50">${audit.totalAnnualSavings}/year potential savings from ${audit.totalMonthlySpend}/mo current spend.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6"><h2 className="mb-2 text-xl font-bold">Personalized summary</h2><p className="text-slate-200">{audit.summary}</p></div>
      {high ? <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6"><h2 className="text-2xl font-bold">Credex can help capture this saving</h2><p className="mt-2 text-emerald-50">Your audit crossed the high-savings threshold. Discounted AI infrastructure credits may reduce retail spend further without changing your workflow.</p></div> : <div className="rounded-3xl border border-white/10 bg-white/10 p-6"><h2 className="text-2xl font-bold">Your stack is close to efficient</h2><p className="mt-2 text-slate-300">Leave your email and we’ll notify you when new optimizations apply.</p></div>}
      <div className="grid gap-4">
        {audit.recommendations.map((r) => <article className="rounded-3xl bg-white p-5 text-slate-950" key={r.item.id}>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold">{r.item.tool} · {r.item.plan}</h3><p className="text-slate-600">{r.reason}</p></div><div className="rounded-2xl bg-slate-100 px-4 py-2 text-right"><b>${r.monthlySavings}/mo</b><p className="text-xs">saved</p></div></div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3"><span>Current: <b>${r.currentSpend}/mo</b></span><span>Recommended: <b>{r.recommendedAction}</b></span><span>New estimate: <b>${r.recommendedSpend}/mo</b></span></div>
        </article>)}
      </div>
      <LeadForm auditId={audit.id} teamSize={audit.input.teamSize}/>
    </section>
  </main>;
}
