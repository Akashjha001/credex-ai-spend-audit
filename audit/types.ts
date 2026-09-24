import type { ToolKey } from './pricing';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type SpendItem = {
  id: string;
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  tools: SpendItem[];
};

export type AuditRecommendation = {
  item: SpendItem;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: 'optimal' | 'minor' | 'meaningful' | 'high';
};

export type AuditResult = {
  id: string;
  input: AuditInput;
  recommendations: AuditRecommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary: string;
  createdAt: string;
};
