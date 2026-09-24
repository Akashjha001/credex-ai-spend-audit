# Architecture

```mermaid
flowchart TD
  A[Visitor] --> B[Next.js Landing + Spend Form]
  B --> C[LocalStorage form persistence]
  B --> D[/api/audit]
  D --> E[Rule-based audit engine]
  E --> F[LLM personalized summary with fallback]
  F --> G[Supabase audits table]
  G --> H[Public /audit/:id result URL]
  H --> I[Lead capture form]
  I --> J[/api/lead]
  J --> K[Supabase leads table]
  J --> L[Resend transactional email]
```

## Data flow

The user enters team size, primary use case, tools, plans, seats, and monthly spend. The browser persists this draft in localStorage. On submit, `/api/audit` runs deterministic rules, calculates monthly and annual savings, generates a summary with Anthropic if configured, stores the public non-identifying audit payload, then returns the audit ID. `/audit/:id` reads the saved public payload and renders the shareable report. Email/company/role are collected only after the audit value is shown.

## Stack choice

Next.js + TypeScript was chosen because it keeps UI, API routes, metadata, and deployment in one repo. Tailwind gives fast custom UI without a pre-built dashboard template. Supabase gives real Postgres storage with low setup time. Resend is simple for transactional email.

## 10k audits/day changes

I would move audit writes to a queue, add Redis-based rate limiting, persist every audit in Supabase/Postgres with indexes on created_at and savings, cache public audit pages at the edge, add structured logs, add Sentry, and move LLM summaries to an async job so the core audit remains fast.
