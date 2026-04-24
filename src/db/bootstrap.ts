export const bootstrapSql = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL REFERENCES users(id) ON DELETE cascade,
  expires_at text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS anonymous_generation_claims (
  id text PRIMARY KEY NOT NULL,
  fingerprint_hash text NOT NULL,
  ip_hash text,
  user_agent_hash text,
  generation_id text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS anonymous_claim_fingerprint_idx
  ON anonymous_generation_claims (fingerprint_hash);

CREATE TABLE IF NOT EXISTS glasses_styles (
  id text PRIMARY KEY NOT NULL,
  name text NOT NULL,
  family text NOT NULL,
  fit text NOT NULL,
  color text NOT NULL,
  material text NOT NULL,
  prompt_notes text NOT NULL,
  is_active integer DEFAULT true NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS user_uploaded_styles (
  id text PRIMARY KEY NOT NULL,
  user_id text REFERENCES users(id) ON DELETE set null,
  source_object_key text,
  extracted_description text NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS generations (
  id text PRIMARY KEY NOT NULL,
  user_id text REFERENCES users(id) ON DELETE set null,
  anonymous_claim_id text REFERENCES anonymous_generation_claims(id) ON DELETE set null,
  style_id text REFERENCES glasses_styles(id) ON DELETE set null,
  uploaded_style_id text REFERENCES user_uploaded_styles(id) ON DELETE set null,
  prompt text NOT NULL,
  model text NOT NULL,
  quality text NOT NULL,
  size text NOT NULL,
  source_deleted_at text,
  result_object_key text,
  result_url text,
  status text DEFAULT 'pending' NOT NULL,
  failure_reason text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL REFERENCES users(id) ON DELETE cascade,
  generation_id text REFERENCES generations(id) ON DELETE set null,
  delta integer NOT NULL,
  reason text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS paypal_orders (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL REFERENCES users(id) ON DELETE cascade,
  paypal_order_id text NOT NULL UNIQUE,
  paypal_capture_id text,
  status text DEFAULT 'created' NOT NULL,
  credits integer NOT NULL,
  amount_cents integer NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;
