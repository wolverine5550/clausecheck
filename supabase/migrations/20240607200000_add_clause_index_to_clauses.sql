-- Migration: Add clause_index column to clauses table
-- Timestamp: 2024-06-07 20:00:00

ALTER TABLE public.clauses ADD COLUMN clause_index integer; 