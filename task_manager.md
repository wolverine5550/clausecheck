# Clause Check MVP Task Manager

This document outlines the step-by-step implementation plan for the Clause Check MVP. Each subsection contains a checklist box `[]` for tracking, with space for comments and file paths. At the end of each feature, unit tests must be written and run.

---

## Supabase Table Summary

| Table         | Managed By    | Purpose                        | Notes                                |
| ------------- | ------------- | ------------------------------ | ------------------------------------ |
| auth.users    | Supabase Auth | User authentication            | Do not create manually               |
| contracts     | You           | Uploaded contract metadata     | FK to auth.users                     |
| clauses       | You           | Extracted clauses + AI results | FK to contracts                      |
| audit_history | You           | User action audit/history      | FK to auth.users, contracts, clauses |

---

## 1. Project Setup

### 1.1 Initialize Project [x]

// Project already initialized

### 1.2 Install Required Dependencies [x]

// Installed: @shadcn/ui, react-hook-form, zod, zustand, eslint, vitest, @testing-library/react, @types/jest
// package.json, package-lock.json

### 1.3 Configure Tailwind CSS and shadcn/ui [x]

// Tailwind and shadcn/ui already configured
// tailwind.config.ts, postcss.config.js, src/styles/globals.css, components.json

### 1.4 Set Up Environment Variables [x]

// Skipped (user already has .env.local)

### 1.5 Set Up Prettier and ESLint [x]

// .eslintrc.json, .prettierrc

### 1.6 Initialize Git and Commit Base [x]

// .git/

### 1.7 Unit Tests for Project Setup [x]

// vitest.config.ts updated to support **tests** folders
// src/utils/**tests**/setup.test.ts

### 1.8 Update README.md (if needed) [x]

// README.md

### 1.9 Update CHANGELOG.md (if needed) [x]

// CHANGELOG.md

### 1.10 Git Commit: Project Setup Complete [x]

// All setup tasks complete, ready for commit

---

## 2. Supabase Integration

### 2.1 Set Up Supabase Project and Tables [x]

// Tables created and migration applied locally and pushed to remote Supabase.
// Migration file: supabase/migrations/20250521132120_create_core_tables.sql

### 2.2 Configure Supabase Client in Next.js [x]

// Supabase client utility created: src/lib/supabase-client.ts
// All imports updated to use: ../../lib/supabase-client

### 2.3 Implement Supabase Auth (Sign Up, Login, Logout) [x]

// Auth form: src/components/auth/auth-form.tsx
// Auth modal: src/components/auth/auth-modal.tsx
// Toast system: src/components/ui/toaster.tsx, src/components/ui/toast.tsx, src/hooks/use-toast.ts
// Toaster added to layout: src/app/layout.tsx
// AuthModal integrated into header: src/components/header-auth.tsx
// Logout button visible for authenticated users
// All imports and type issues resolved

### 2.4 Protect Routes for Authenticated Users [x]

// Utility for server-side route protection: src/utils/supabase/require-user-or-redirect.ts
// Example usage in protected page: src/app/protected/page.tsx
// All protected pages should use this utility for consistent auth checks

### 2.5 Test Auth Flows (Sign Up, Login, Logout, Route Protection) [x]

// Unit tests for AuthForm: src/components/auth/**tests**/auth-form.test.tsx
// Unit tests for route protection utility: src/utils/supabase/**tests**/require-user-or-redirect.test.ts
// Tests cover form validation, Supabase logic, and server-side route protection

### 2.6 Unit Tests for Supabase Integration [x]

// Fixed Vitest mocking and hoisting issues for Supabase client and route protection tests.
// - In `src/components/auth/__tests__/auth-form.test.tsx`, the Supabase client mock is exposed from the vi.mock factory as `mockAuth` and accessed in tests via `(supabaseClient as any).mockAuth`. This ensures the test assertions use the same mock instance as the component under test, avoiding issues where new mock instances are created and not called by the component.
// - In `src/utils/supabase/__tests__/require-user-or-redirect.test.ts`, the mock is exposed as `_mockAuth` from the vi.mock factory and accessed in tests via `(serverModule as any)._mockAuth`. This avoids all top-level variable hoisting issues and ensures the test always uses the correct mock instance.
// - These changes resolve errors caused by Vitest's hoisting of vi.mock and the inability to reference or assign top-level variables inside the mock factory. The new pattern is robust for ESM/CJS and path alias environments.
// - All tests now pass. Use this pattern for future Supabase-related tests.
// - Files changed: src/components/auth/**tests**/auth-form.test.tsx, src/utils/supabase/**tests**/require-user-or-redirect.test.ts

### 2.7 Update README.md (if needed) [x]

// Updated README.md with a detailed section on Vitest mocking/hoisting issues and the robust pattern for mocking Supabase client/server utilities. See 'Testing Supabase Client and Route Protection Utilities with Vitest'.

### 2.8 Update CHANGELOG.md (if needed) [x]

// Updated CHANGELOG.md with a detailed entry describing the Vitest mocking/hoisting fix, the new pattern, and the files changed.

### 2.9 Git Commit: Supabase Integration Complete []

---

## 3. File Upload Feature

### 3.1 Integrate Supabase Auth Provider and useUser hook in app [x]

// Integrated SessionContextProvider and useUser from @supabase/auth-helpers-react for client-side auth state.
// Files: src/app/layout.tsx, src/components/client-supabase-provider.tsx, src/components/upload/contract-upload-form.tsx

### 3.2 Create ClientOnlySupabaseProvider wrapper to avoid marking root layout as client component [x]

// Created client-only provider to wrap app content, keeping root layout as server component.
// Files: src/components/client-supabase-provider.tsx, src/app/layout.tsx

### 3.3 Create Upload Page and UI (Dropzone, Form) [x]

// Implemented modular upload form and upload page UI.
// Files: src/app/upload/page.tsx, src/components/upload/contract-upload-form.tsx

### 3.4 Validate File Types and Size [x]

// File type and size validation implemented in upload form using zod.
// Files: src/components/upload/contract-upload-form.tsx

### 3.5 Enforce Rate Limiting (5 uploads/hour/user) [x]

// Rate limiting implemented in API route and UI feedback added.
// Files: src/app/api/upload/route.ts, src/components/upload/contract-upload-form.tsx
// Added toast components: src/components/ui/toast.tsx, src/components/ui/use-toast.ts, src/components/ui/toaster.tsx

### 3.6 Create Supabase Storage Bucket [x]

// Created private 'contracts' bucket in Supabase dashboard for file uploads.

### 3.7 (Optional) Set Supabase Storage Bucket Policies [x]

// RLS/storage policies created for 'contracts' bucket:
// - INSERT: bucket_id = 'contracts' AND auth.role() = 'authenticated'
// - SELECT/DELETE: bucket_id = 'contracts' AND auth.role() = 'authenticated' AND storage.objects.owner = auth.uid()

### 3.8 Upload Files to Supabase Storage [x]

// Upload form now sends file as FormData, API route uploads to Supabase Storage and inserts metadata in contracts table.
// Files: src/components/upload/contract-upload-form.tsx, src/app/api/upload/route.ts

### 3.9 Fix Supabase client/server utilities to use @supabase/auth-helpers-nextjs [x]

// Removed all @supabase/ssr usage, updated all client/server utilities to use @supabase/auth-helpers-nextjs.
// Files: src/lib/supabase-client.ts, src/utils/supabase/server.ts

### 3.10 Fix file input registration for react-hook-form [x]

// Fixed file input registration to work with react-hook-form, removed conflicting ref usage.
// Files: src/components/upload/contract-upload-form.tsx

### 3.11 Fix API route authentication/session handling for Next.js 15 [x]

// Updated API route to use cookies() synchronously for Supabase session detection, per Next.js 15 requirements.
// Files: src/app/api/upload/route.ts

### 3.12 Extract Raw Text from Uploaded Files [x]

// Implemented server-side extraction of raw text from PDF and DOCX files after upload using pdf-parse and mammoth.
// Extraction utility: src/lib/utils/extract-raw-text.ts
// API route updated: src/app/api/upload/route.ts
// Migration: supabase/migrations/20240523190000_add_raw_text_column_contracts.sql

### 3.13 Error Handling and User Feedback (Alert) [x]

// Error handling and user feedback improved for file upload feature.
// Added shadcn/ui Alert component for inline feedback.
// Updated API route to always return message and warning fields.
// Updated upload form to display all error/warning fields using Alert and Toast.
// Files: src/app/api/upload/route.ts, src/components/upload/contract-upload-form.tsx, src/components/ui/alert.tsx

### 3.14 Unit Tests for File Upload Feature [x]

// Unit tests for file upload feature:
// - ContractUploadForm: src/components/upload/**tests**/contract-upload-form.test.tsx
// - Alert component: src/components/ui/**tests**/alert.test.tsx
// (API route tests to be added in a future step if needed)

### 3.15 Update README.md [x]

// Updated README.md to document Alert accessibility (role="alert"), robust UI testing, and API route handler test skipping.
// File: README.md

### 3.16 Update CHANGELOG.md [x]

// Updated CHANGELOG.md to document Alert accessibility/testing, robust UI test pass, and API route handler test skipping.
// File: CHANGELOG.md

### 3.17 Git Commit: File Upload Feature Complete [x]

---

## 4. Clause Extraction

### 4.1 Implement Clause Extraction Utility (lib/utils/extractClauses.ts) [x]

// Implemented in: src/lib/utils/extractClauses.ts

### 4.2 Parse and Split Uploaded Document into Clauses [x]

// Implemented in: src/app/api/upload/route.ts (calls extractClauses after raw text extraction)

### 4.3 Store Extracted Clauses (Temp DB or Memory) [x]

// Implemented in: src/app/api/upload/route.ts (inserts into Supabase clauses table)

### 4.4 Unit Tests for Clause Extraction [x]

// Tests: src/lib/utils/**tests**/extractClauses.test.ts

### 4.5 Update README.md (if needed) [x]

// Updated: README.md (documented clause extraction utility, API route integration, and test coverage)

### 4.6 Update CHANGELOG.md (if needed) [x]

// Updated: CHANGELOG.md (documented clause extraction feature, API route changes, and test coverage)

### 4.7 Git Commit: Clause Extraction Complete [x]

---

## 5. AI-Powered Clause Analysis

### 5.1 Integrate OpenAI API [x]

// See: src/lib/utils/openai-clause-analysis.ts, src/lib/utils/openai-clause-analysis.types.ts

### 5.2 Send Clauses for Analysis (Risk, Explanation, Suggestion) [x]

// See: src/app/api/contracts/[contractId]/analyze/route.ts (triggers analysis for up to 10 pending clauses)

### 5.3 Handle API Failures (Retry, Alert) [x]

// See: src/app/api/contracts/[contractId]/analyze/route.ts (sets analysis_status to 'error', returns warnings)

### 5.4 Store Analysis Results [x]

// See: supabase/migrations/20240607180000_remove_risk_level_add_risk_score_clauses.sql, supabase/migrations/20240607190000_add_analysis_status_to_clauses.sql, src/app/api/contracts/[contractId]/analyze/route.ts

### 5.5 Unit Tests for AI Analysis [x]

// See: src/lib/utils/**tests**/openai-clause-analysis.test.ts

### 5.6 Update README.md (if needed) [x]

### 5.7 Update CHANGELOG.md (if needed) [x]

### 5.8 Git Commit: AI Analysis Complete [x]

---

## 6. Results Display

### 6.1 Create Results Page and UI (Card, Badge, Accordion, CopyButton) [x]

// Files: src/app/results/page.tsx, src/components/results/ClauseCard.tsx, src/components/results/ClauseAccordion.tsx, src/components/results/CopyButton.tsx

### 6.2 Render Color-Coded Clause Cards [x]

// Files: src/components/results/ClauseCard.tsx

### 6.3 Show AI Suggestions and Allow Copying [x]

// Files: src/components/results/ClauseAccordion.tsx, src/components/results/CopyButton.tsx

### 6.4 Responsive and Accessible UI [x]

// Files: src/components/results/ClauseCard.tsx, src/components/results/ClauseAccordion.tsx, src/components/results/CopyButton.tsx

### 6.5 Unit Tests for Results Display [x]

// [x] Fixed use-toast mocking and test reliability in CopyButton.test.tsx (src/components/results/**tests**/CopyButton.test.tsx)
// [x] Fixed ClauseAccordion closed state test (src/components/results/**tests**/ClauseAccordion.test.tsx)
// [x] Added role="status" to Skeletons for accessibility and test match (src/app/results/page.tsx)
// [x] All Results Display unit tests now pass

### 6.6 Performance and Accessibility Audit [x]

// [x] Results Display performance and accessibility reviewed. All interactive elements use shadcn/ui, role attributes, and are tested for keyboard/screen reader access. See src/app/results/page.tsx, src/components/results/ClauseCard.tsx, src/components/results/ClauseAccordion.tsx, src/components/results/CopyButton.tsx

### 6.7 Update README.md [x]

// [x] README.md updated to document Results Display accessibility, test reliability, and traceability improvements. See README.md

### 6.8 Update CHANGELOG.md [x]

// [x] CHANGELOG.md updated with Results Display test, accessibility, and traceability improvements. See CHANGELOG.md

### 6.9 Git Commit: Results Display Complete [x]

// [x] All Results Display features, tests, and documentation complete and committed.

---

## 7. Audit/History Tracking

### 7.1 Implement Audit/History Table in Supabase []

### 7.2 Track User Actions (Upload, Analyze, Delete) []

### 7.3 Display User History in UI []

### 7.4 Unit Tests for Audit/History Feature []

### 7.5 Update README.md (if needed) []

### 7.6 Update CHANGELOG.md (if needed) []

### 7.7 Git Commit: Audit/History Feature Complete []

---

## 8. Data Retention & Deletion

### 8.1 Implement 30-Day Data Expiry Logic []

### 8.2 Allow Users to Delete Uploads/Results []

### 8.3 Unit Tests for Data Retention/Deletion []

### 8.4 Security Review: Check for Sensitive Data, Permissions, etc. []

### 8.5 Update README.md (if needed) []

### 8.6 Update CHANGELOG.md (if needed) []

### 8.7 Git Commit: Data Retention & Deletion Complete []

---

## 9. Demo Mode for Unauthenticated Users

### 9.1 Create Demo Page with Sample Contract and Analysis []

### 9.2 Restrict Upload/Analyze to Authenticated Users []

### 9.3 Unit Tests for Demo Mode []

### 9.4 Update README.md (if needed) []

### 9.5 Update CHANGELOG.md (if needed) []

### 9.6 Git Commit: Demo Mode Complete []

---

## 10. Analytics & Monitoring

### 10.1 Integrate Supabase Logs for Usage/Error Tracking []

### 10.2 Unit Tests for Analytics Logic []

### 10.3 Update README.md (if needed) []

### 10.4 Update CHANGELOG.md (if needed) []

### 10.5 Git Commit: Analytics & Monitoring Complete []

---

## 11. Deployment

### 11.1 Prepare for Vercel Deployment (env vars, config) []

### 11.2 Deploy to Vercel []

### 11.3 Manual QA: Test All User Flows and Edge Cases []

### 11.4 Post-Deploy Smoke Test []

### 11.5 Update README.md (if needed) []

### 11.6 Update CHANGELOG.md (if needed) []

### 11.7 Git Commit: Deployment Complete []

---

## 12. Documentation

### 12.1 Update README.md and instructions.md []

### 12.2 Add Comments and File Paths in task_manager.md []

### 12.3 Update CHANGELOG.md (if needed) []

### 12.4 Git Commit: Documentation Complete []

---

// 20240523_add_raw_text_column_contracts.sql: Added raw_text column to contracts table for storing extracted contract text.
// Files updated: supabase/migrations/20240523_add_raw_text_column_contracts.sql, src/app/api/upload/route.ts (future use), src/types/Contract (if/when created)

// 20240607_remove_risk_level_add_risk_score_clauses.sql: Removed risk_level column and added risk_score (integer) to clauses table for numeric risk scoring.
// Files updated: supabase/migrations/20240607180000_remove_risk_level_add_risk_score_clauses.sql, Supabase schema

// Added OpenAI clause analysis utility and types for AI-powered clause analysis.
// Files added: src/lib/utils/openai-clause-analysis.ts, src/lib/utils/openai-clause-analysis.types.ts, src/lib/utils/**tests**/openai-clause-analysis.test.ts

// 20240607_add_analysis_status_to_clauses.sql: Added analysis_status (text, default 'pending') to clauses table for tracking clause analysis state.
// Files updated: supabase/migrations/20240607190000_add_analysis_status_to_clauses.sql, Supabase schema

// Added API route to trigger clause analysis for a contract: POST /api/contracts/[contractId]/analyze
// Analyzes up to 10 pending clauses, updates analysis_status, and returns a summary.
// File: src/app/api/contracts/[contractId]/analyze/route.ts

// 20240607_add_clause_index_to_clauses.sql: Added clause_index (integer) to clauses table for tracking original clause order.
// Files updated: supabase/migrations/20240607200000_add_clause_index_to_clauses.sql, src/app/api/upload/route.ts
// Clause extraction logic now stores clause_index for reading order display and queries.
