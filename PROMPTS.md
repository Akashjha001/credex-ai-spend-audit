# Prompts

## Personalized audit summary prompt

```text
Write a concise ~100-word executive summary for this AI spend audit. Be specific, honest, and finance-literate. Do not invent savings. Data: {{audit_json}}
```

## Why this prompt

The prompt forces the model to summarize only existing deterministic audit output. It explicitly says not to invent savings because the model should not create new financial claims.

## What did not work

A longer prompt that asked the model to recommend plan changes produced unsupported advice. I removed recommendation generation from the LLM and kept it in the rule-based engine.
