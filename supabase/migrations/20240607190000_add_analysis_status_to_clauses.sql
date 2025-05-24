-- Migration: Add analysis_status column to clauses table
-- Timestamp: 2024-06-07 19:00:00

ALTER TABLE public.clauses ADD COLUMN analysis_status text DEFAULT 'pending'; 