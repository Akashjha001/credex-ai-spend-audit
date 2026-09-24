# Credex AI Spend Audit

A free, no-login web app for startup founders and engineering managers to audit AI tool spend across Cursor, Copilot, Claude, ChatGPT, APIs, Gemini, and v0. Users enter their stack, get instant savings recommendations, capture the report by email, and share a public audit URL.

## Screenshots

Add screenshots after deploying:
1. Landing page / spend input form
2. Audit results page
3. Lead capture + shareable public URL

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
npm run test
```

Open `http://localhost:3000`.

## Deployment

Deploy on Vercel. Add the environment variables from `.env.example`. Supabase and Resend are optional for local demo, but required for production storage and transactional email.

## Decisions

1. **Next.js fullstack over separate backend** — fewer moving parts and easier share URLs/OG metadata.
2. **Rule-based audit engine** — pricing math must be deterministic and defensible, not LLM-generated.
3. **Email after value** — user sees savings before entering email, matching the assignment requirement.
4. **Supabase optional fallback** — local demo works without secrets; production uses Postgres-backed storage.
5. **Honeypot abuse protection** — simple, invisible, and good enough for a low-friction lead capture form.

## Deployed URL

Add your Vercel URL here.
