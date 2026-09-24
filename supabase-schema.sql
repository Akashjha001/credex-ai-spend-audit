create table if not exists audits (
  id text primary key,
  public_payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  audit_id text references audits(id),
  email text not null,
  company text,
  role text,
  team_size int,
  created_at timestamptz not null default now()
);
