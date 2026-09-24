export type ToolKey =
  | 'cursor'
  | 'copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'v0';

export type PlanPrice = { plan: string; price: number; unit: 'seat' | 'account' | 'usage'; source: string };

export const pricing: Record<ToolKey, PlanPrice[]> = {
  cursor: [
    { plan: 'Hobby', price: 0, unit: 'seat', source: 'https://cursor.com/pricing' },
    { plan: 'Pro', price: 20, unit: 'seat', source: 'https://cursor.com/pricing' },
    { plan: 'Business', price: 40, unit: 'seat', source: 'https://cursor.com/pricing' },
    { plan: 'Enterprise', price: 60, unit: 'seat', source: 'https://cursor.com/pricing' }
  ],
  copilot: [
    { plan: 'Individual', price: 10, unit: 'seat', source: 'https://github.com/features/copilot/plans' },
    { plan: 'Business', price: 19, unit: 'seat', source: 'https://github.com/features/copilot/plans' },
    { plan: 'Enterprise', price: 39, unit: 'seat', source: 'https://github.com/features/copilot/plans' }
  ],
  claude: [
    { plan: 'Free', price: 0, unit: 'account', source: 'https://www.anthropic.com/pricing' },
    { plan: 'Pro', price: 20, unit: 'account', source: 'https://www.anthropic.com/pricing' },
    { plan: 'Max', price: 100, unit: 'account', source: 'https://www.anthropic.com/pricing' },
    { plan: 'Team', price: 30, unit: 'seat', source: 'https://www.anthropic.com/pricing' },
    { plan: 'Enterprise', price: 60, unit: 'seat', source: 'https://www.anthropic.com/pricing' },
    { plan: 'API direct', price: 0, unit: 'usage', source: 'https://www.anthropic.com/pricing' }
  ],
  chatgpt: [
    { plan: 'Plus', price: 20, unit: 'account', source: 'https://openai.com/chatgpt/pricing/' },
    { plan: 'Team', price: 30, unit: 'seat', source: 'https://openai.com/chatgpt/pricing/' },
    { plan: 'Enterprise', price: 60, unit: 'seat', source: 'https://openai.com/chatgpt/pricing/' },
    { plan: 'API direct', price: 0, unit: 'usage', source: 'https://openai.com/api/pricing/' }
  ],
  anthropic_api: [{ plan: 'API direct', price: 0, unit: 'usage', source: 'https://www.anthropic.com/pricing' }],
  openai_api: [{ plan: 'API direct', price: 0, unit: 'usage', source: 'https://openai.com/api/pricing/' }],
  gemini: [
    { plan: 'Pro', price: 20, unit: 'account', source: 'https://one.google.com/about/google-ai-plans/' },
    { plan: 'Ultra', price: 250, unit: 'account', source: 'https://one.google.com/about/google-ai-plans/' },
    { plan: 'API', price: 0, unit: 'usage', source: 'https://ai.google.dev/pricing' }
  ],
  v0: [
    { plan: 'Free', price: 0, unit: 'account', source: 'https://v0.dev/pricing' },
    { plan: 'Premium', price: 20, unit: 'account', source: 'https://v0.dev/pricing' },
    { plan: 'Team', price: 30, unit: 'seat', source: 'https://v0.dev/pricing' }
  ]
};

export function getPlanPrice(tool: ToolKey, plan: string): PlanPrice | undefined {
  return pricing[tool].find((p) => p.plan.toLowerCase() === plan.toLowerCase());
}
