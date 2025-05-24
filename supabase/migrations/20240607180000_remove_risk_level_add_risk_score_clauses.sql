-- Migration: Remove risk_level and add risk_score to clauses table
-- Timestamp: 2024-06-07 18:00:00

ALTER TABLE public.clauses DROP COLUMN IF EXISTS risk_level;
ALTER TABLE public.clauses ADD COLUMN risk_score integer; 