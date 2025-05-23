-- Migration: Add raw_text column to contracts table
-- Adds a nullable text column for storing the full extracted contract text for downstream clause extraction and AI analysis.

ALTER TABLE contracts ADD COLUMN raw_text text; 