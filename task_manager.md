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

### 3.1 Create Upload Page and UI (Dropzone, Form) []

### 3.2 Validate File Types and Size []

### 3.3 Enforce Rate Limiting (5 uploads/hour/user) []

### 3.4 Upload Files to Supabase Storage []

### 3.5 Extract Raw Text from Uploaded Files []

### 3.6 Error Handling and User Feedback (Alert) []

### 3.7 Unit Tests for File Upload Feature []

### 3.8 Update README.md (if needed) []

### 3.9 Update CHANGELOG.md (if needed) []

### 3.10 Git Commit: File Upload Feature Complete []

---

## 4. Clause Extraction

### 4.1 Implement Clause Extraction Utility (lib/utils/extractClauses.ts) []

### 4.2 Parse and Split Uploaded Document into Clauses []

### 4.3 Store Extracted Clauses (Temp DB or Memory) []

### 4.4 Unit Tests for Clause Extraction []

### 4.5 Update README.md (if needed) []

### 4.6 Update CHANGELOG.md (if needed) []

### 4.7 Git Commit: Clause Extraction Complete []

---

## 5. AI-Powered Clause Analysis

### 5.1 Integrate OpenAI API []

### 5.2 Send Clauses for Analysis (Risk, Explanation, Suggestion) []

### 5.3 Handle API Failures (Retry, Alert) []

### 5.4 Store Analysis Results []

### 5.5 Unit Tests for AI Analysis []

### 5.6 Update README.md (if needed) []

### 5.7 Update CHANGELOG.md (if needed) []

### 5.8 Git Commit: AI Analysis Complete []

---

## 6. Results Display

### 6.1 Create Results Page and UI (Card, Badge, Accordion, CopyButton) []

### 6.2 Render Color-Coded Clause Cards []

### 6.3 Show AI Suggestions and Allow Copying []

### 6.4 Responsive and Accessible UI []

### 6.5 Unit Tests for Results Display []

### 6.6 Performance and Accessibility Audit []

### 6.7 Update README.md (if needed) []

### 6.8 Update CHANGELOG.md (if needed) []

### 6.9 Git Commit: Results Display Complete []

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
