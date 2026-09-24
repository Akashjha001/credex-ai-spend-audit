# Reflection

## 1. Hardest bug

The hardest bug was keeping the audit result shareable without exposing lead information. My first approach stored one large payload that mixed the audit input with email capture fields. That made the implementation simple, but it violated the public URL privacy requirement. I debugged it by tracing the data flow from form submit to result render and listing which fields should be public versus private. The fix was to split storage into public audit payloads and private lead records. The public payload contains tools, spend, plans, and savings only; the lead table stores email, company, role, and team size.

## 2. Decision reversed

I initially considered using an LLM to generate recommendations because it would create natural-sounding advice quickly. I reversed that decision after reading the requirement that audit math should be hardcoded and defensible. A finance person needs to understand every number. The final design uses deterministic rules for savings and only uses the LLM for a short personalized summary. That made the product easier to test and more trustworthy.

## 3. Week 2 build

In week 2 I would add benchmarking by company stage and team size. The current product says whether your stack is inefficient, but it does not yet compare spend per developer against peers. I would also add a PDF report, CRM routing for high-savings leads, and a mini admin view for Credex to see top opportunities by vendor, savings range, and company size.

## 4. AI usage

I used AI for brainstorming edge cases, copy variations, and checking whether documentation was clear. I did not trust AI with pricing numbers, savings calculations, or final architecture decisions. One specific wrong suggestion was to let an LLM decide downgrade recommendations dynamically. I rejected that because it would make the recommendation path hard to test and hard to defend.

## 5. Self-rating

- Discipline: 8/10 — I kept the scope focused on the six MVP requirements.
- Code quality: 7/10 — The core logic is typed and tested, but more validation could be added.
- Design sense: 7/10 — The result page is clean and shareable, with room for more visual polish.
- Problem-solving: 8/10 — I separated public audit data from private lead data after identifying the privacy risk.
- Entrepreneurial thinking: 8/10 — The tool is built around lead generation after delivering user value.
