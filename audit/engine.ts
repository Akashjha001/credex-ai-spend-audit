import { getPlanPrice, pricing } from './pricing';
import type { AuditInput, AuditRecommendation, AuditResult, SpendItem } from './types';

const toolNames: Record<string, string> = {
  cursor: 'Cursor', copilot: 'GitHub Copilot', claude: 'Claude', chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API', openai_api: 'OpenAI API', gemini: 'Gemini', v0: 'v0'
};

function sameVendorCheaper(item: SpendItem, teamSize: number): { action: string; spend: number; reason: string } | null {
  const lowerPlan = getPlanPrice(item.tool, item.plan);
  if (!lowerPlan) return null;

  if (item.tool === 'cursor' && ['Business', 'Enterprise'].includes(item.plan) && teamSize <= 5) {
    return { action: 'Downgrade to Cursor Pro', spend: 20 * item.seats, reason: 'Small teams usually do not need admin controls or enterprise procurement features.' };
  }
  if (item.tool === 'chatgpt' && ['Team', 'Enterprise'].includes(item.plan) && item.seats <= 2) {
    return { action: 'Move to ChatGPT Plus accounts', spend: 20 * item.seats, reason: 'For one or two seats, Plus captures most individual productivity value without team overhead.' };
  }
  if (item.tool === 'claude' && item.plan === 'Max' && item.monthlySpend >= 100 && item.seats <= 2) {
    return { action: 'Test Claude Pro before Max', spend: 20 * item.seats, reason: 'Max only pays back when daily high-volume use consistently hits Pro limits.' };
  }
  if (item.tool === 'gemini' && item.plan === 'Ultra' && item.monthlySpend >= 250 && item.seats <= 3) {
    return { action: 'Move Gemini Ultra users to Pro', spend: 20 * item.seats, reason: 'Ultra is rarely justified for small teams unless it is replacing several premium tools.' };
  }
  if (item.tool === 'v0' && item.plan === 'Team' && item.seats <= 2) {
    return { action: 'Use v0 Premium or Free until design volume grows', spend: 20, reason: 'Team billing is inefficient for one-off prototype usage.' };
  }
  return null;
}

function alternative(item: SpendItem, useCase: AuditInput['useCase']): { action: string; spend: number; reason: string } | null {
  if (useCase === 'coding' && item.tool === 'chatgpt' && item.plan === 'Enterprise' && item.monthlySpend > 500) {
    return { action: 'Shift coding seats to Cursor Pro + keep fewer ChatGPT seats', spend: Math.max(20 * item.seats, item.monthlySpend * 0.55), reason: 'For coding-heavy teams, IDE-native tools often reduce paid general-chat seats.' };
  }
  if (useCase === 'writing' && item.tool === 'cursor') {
    return { action: 'Remove non-coding Cursor seats', spend: 0, reason: 'Cursor is coding-first; writing workflows should not carry IDE subscription spend.' };
  }
  if (item.tool.endsWith('_api') && item.monthlySpend > 1000) {
    return { action: 'Route high-volume API spend through committed credits', spend: item.monthlySpend * 0.7, reason: 'Large API usage is where negotiated or discounted credits can reduce retail spend.' };
  }
  return null;
}

export function runAudit(input: AuditInput, id = crypto.randomUUID()): AuditResult {
  const recommendations: AuditRecommendation[] = input.tools.map((item) => {
    const currentSpend = Math.max(0, Number(item.monthlySpend || 0));
    const candidates = [sameVendorCheaper(item, input.teamSize), alternative(item, input.useCase)].filter(Boolean) as { action: string; spend: number; reason: string }[];
    const best = candidates.sort((a, b) => a.spend - b.spend)[0];

    let recommendedSpend = currentSpend;
    let action = 'Keep current plan';
    let reason = 'Spend appears aligned with the selected plan and team size.';

    const listPrice = getPlanPrice(item.tool, item.plan);
    if (!best && listPrice && listPrice.price > 0) {
      const expected = listPrice.unit === 'seat' ? listPrice.price * item.seats : listPrice.price;
      if (currentSpend > expected * 1.25) {
        recommendedSpend = expected;
        action = 'Reconcile invoice against official list price';
        reason = 'Reported spend is materially above public pricing for this plan.';
      }
    }

    if (best) {
      recommendedSpend = Math.min(currentSpend, Math.round(best.spend));
      action = best.action;
      reason = best.reason;
    }

    const monthlySavings = Math.max(0, Math.round(currentSpend - recommendedSpend));
    const severity = monthlySavings >= 500 ? 'high' : monthlySavings >= 100 ? 'meaningful' : monthlySavings > 0 ? 'minor' : 'optimal';

    return { item, currentSpend, recommendedAction: action, recommendedSpend, monthlySavings, annualSavings: monthlySavings * 12, reason, severity };
  });

  const totalMonthlySpend = recommendations.reduce((sum, r) => sum + r.currentSpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    id,
    input,
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    summary: fallbackSummary({ totalMonthlySavings, totalAnnualSavings, recommendations }),
    createdAt: new Date().toISOString()
  };
}

export function fallbackSummary(result: Pick<AuditResult, 'totalMonthlySavings' | 'totalAnnualSavings' | 'recommendations'>): string {
  if (result.totalMonthlySavings < 100) {
    return 'Your AI stack looks fairly efficient. The best next step is to keep tracking seat usage and revisit pricing when your team or usage changes.';
  }
  const top = [...result.recommendations].sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
  return `Your largest opportunity is ${toolNames[top.item.tool] ?? top.item.tool}: ${top.recommendedAction.toLowerCase()}. Overall, this audit found about $${result.totalMonthlySavings}/mo ($${result.totalAnnualSavings}/yr) in defensible savings without reducing core AI capability.`;
}

export { pricing };
