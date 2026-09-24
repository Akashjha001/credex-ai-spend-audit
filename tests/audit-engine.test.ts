import { describe, expect, it } from 'vitest';
import { runAudit } from '../audit/engine';

describe('audit engine', () => {
  it('downgrades small Cursor Business teams to Pro', () => {
    const result = runAudit({ teamSize: 3, useCase: 'coding', tools: [{ id: 'a', tool: 'cursor', plan: 'Business', seats: 3, monthlySpend: 120 }] }, 'test');
    expect(result.totalMonthlySavings).toBe(60);
    expect(result.recommendations[0].recommendedAction).toContain('Cursor Pro');
  });

  it('flags ChatGPT Team for two seats', () => {
    const result = runAudit({ teamSize: 2, useCase: 'mixed', tools: [{ id: 'a', tool: 'chatgpt', plan: 'Team', seats: 2, monthlySpend: 60 }] }, 'test');
    expect(result.totalMonthlySavings).toBe(20);
  });

  it('does not manufacture savings for optimal spend', () => {
    const result = runAudit({ teamSize: 5, useCase: 'coding', tools: [{ id: 'a', tool: 'copilot', plan: 'Business', seats: 5, monthlySpend: 95 }] }, 'test');
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations[0].severity).toBe('optimal');
  });

  it('recommends credits for high API spend', () => {
    const result = runAudit({ teamSize: 10, useCase: 'data', tools: [{ id: 'a', tool: 'openai_api', plan: 'API direct', seats: 10, monthlySpend: 2000 }] }, 'test');
    expect(result.totalMonthlySavings).toBe(600);
    expect(result.recommendations[0].severity).toBe('high');
  });

  it('calculates annual savings from monthly savings', () => {
    const result = runAudit({ teamSize: 1, useCase: 'research', tools: [{ id: 'a', tool: 'claude', plan: 'Max', seats: 1, monthlySpend: 100 }] }, 'test');
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });
});
