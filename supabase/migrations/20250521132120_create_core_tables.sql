-- Migration: Create core tables for Clause Check MVP
-- Timestamp: 2025-05-21 13:21:20

-- Table: contracts
CREATE TABLE IF NOT EXISTS contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    uploaded_at timestamptz NOT NULL DEFAULT now(),
    -- Add more metadata fields as needed
    description text
);

-- Table: clauses
CREATE TABLE IF NOT EXISTS clauses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    clause_text text NOT NULL,
    -- AI analysis fields
    risk_level text, -- e.g., 'low', 'medium', 'high'
    explanation text,
    suggestion text,
    analyzed_at timestamptz DEFAULT now(),
    -- Add more fields as needed
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: audit_history
CREATE TABLE IF NOT EXISTS audit_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id uuid REFERENCES contracts(id) ON DELETE SET NULL,
    clause_id uuid REFERENCES clauses(id) ON DELETE SET NULL,
    action text NOT NULL, -- e.g., 'upload', 'analyze', 'delete'
    action_at timestamptz NOT NULL DEFAULT now(),
    details jsonb -- Optional: store extra info about the action
); 