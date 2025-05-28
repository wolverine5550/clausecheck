📄 PRD — clausecheck

Tagline: Upload any contract and get instant, AI-powered analysis of its riskiest clauses.Goal: Build a tightly scoped full-stack app using Next.js + OpenAI + shadcn/ui to practice file handling, chunked AI tasks, and clean UI—all deployed and tested E2E.

🎯 Objective

Create a functional MVP where:

- **User authentication is required** to upload and analyze contracts (Supabase Auth). Unauthenticated users can access a limited demo only.
- Users upload a legal agreement (PDF or DOCX)
- The app extracts and splits clauses
- Each clause is analyzed with AI for risk level and clarity
- Users receive color-coded clause cards with rewrite suggestions
- All UI is built using shadcn/ui components
- This is a focused project to get hands-on with full-stack document workflows, OpenAI integration, and basic content moderation/safety practices.

⚙️ Tech Stack

Layer

Tech

Frontend

Next.js (App Router, TypeScript)

Styling

Tailwind CSS + shadcn/ui

File I/O

Supabase Storage or Vercel Blob

AI Engine

OpenAI GPT-4 Turbo

Hosting

Vercel

Parsing

pdf-parse, mammoth, or similar doc extractors

Forms

react-hook-form + zod

**Auth**

Supabase Auth (users must log in to upload/analyze; demo for unauthenticated users)

Analytics/Monitoring

Supabase logs, Sentry, or similar

- MVP: Admin-only analytics dashboard at `/admin/analytics` tracks user activity (uploads, analyses, deletes) from the audit_history table. Access is restricted to the admin email for MVP. Raw Supabase logs are not exposed in the UI for security reasons.

🤩 Core Features

1. Contract Upload

Drag/drop or click-to-upload interface

Validate file types: .pdf, .docx only

**File size limit:** 10MB per file (best judgment)

**Rate limit:** 5 uploads per user per hour (best judgment)

Upload stored in Supabase or edge blob storage

Extract raw text immediately after upload

Use Dropzone, Form, Alert, Skeleton, Button

2. Clause Extraction

Parse document text into sections or clauses

Split intelligently by:

Paragraphs with legal structure

Headings, numbered lists, etc.

Store clauses in memory or temp DB cache

Implement with helper utilities in lib/utils/extractClauses.ts

3. AI-Powered Analysis

Send each clause (or batch) to OpenAI

Return:

Risk score (standard / unusual / risky)

Plain-English explanation

Optional rewrite suggestion

**Retry on failure; notify user if parsing or AI analysis fails.**

Use OpenAI's function-calling format or standard prompts.

4. Results Display

Render each clause in a scrollable list

Card layout:

Clause text

Color-coded risk level (🟢 🟡 🔴)

Tooltip or section for rewrite suggestion

Allow copying AI suggestion

Use Card, Badge, Tooltip, Accordion, CopyButton, etc.

5. **Audit/History Tracking**

Track user actions (uploads, deletions, analysis) for audit/history purposes.

Store in a dedicated audit/history table in Supabase.

6. **Analytics/Monitoring**

Track usage, errors, and performance using Supabase logs, Sentry, or similar tools.

7. **Data Retention & Deletion**

Contracts and analysis results are stored for 30 days.

Users can delete their uploads and results at any time.

💃 Supabase Schema (SQL)

-- Users managed by Supabase Auth
-- No need to create a separate users table

```
-- Uploaded contracts
create table contracts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  created_at timestamp default now(),
  expires_at timestamp generated always as (created_at + interval '30 days') stored
);

-- Extracted clauses
create table clauses (
  id uuid primary key default uuid_generate_v4(),
  contract_id uuid references contracts(id) on delete cascade,
  clause_text text not null,
  risk_level text check (risk_level in ('standard', 'unusual', 'risky')),
  ai_explanation text,
  ai_suggestion text,
  created_at timestamp default now()
);

-- Audit/history table
create table audit_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null, -- e.g. 'upload', 'analyze', 'delete'
  contract_id uuid references contracts(id),
  clause_id uuid references clauses(id),
  details jsonb,
  created_at timestamp default now()
);
```

UI Pages

Page

Features

Key shadcn/ui Components

/

Landing page (optional)

Card, Button, Hero, Footer

/upload

File upload + clause parse

Dropzone, Form, Alert, Button

/results

Display clause analysis

Card, Badge, Accordion, Skeleton

/404

Fallback route

Card, Button

🧪 Success Criteria

User can upload a valid file

Clauses are correctly parsed and chunked

AI response returns explanation + suggestion per clause

UI renders clause cards with correct data

Risk levels are visually distinct and intuitive

MVP is clean, minimal, fast, and deployed to Vercel

✅ Additional Goals

User login with Supabase Auth

Save upload history for repeat analysis

Download annotated version (with flags/summaries)

Shareable links to contract summaries

### 📦 Required Packages

List of npm packages required for this project:

- next (App Router, SSR)
- @supabase/supabase-js (Supabase client)
- @supabase/auth-helpers-nextjs (Supabase Auth integration)
- @supabase/storage-js (Supabase Storage)
- @shadcn/ui (UI components)
- tailwindcss (Styling)
- react-hook-form (Forms)
- zod (Validation)
- openai (OpenAI API client)
- pdf-parse (PDF extraction)
- mammoth (DOCX extraction)
- lucide-react (Icons)
- zustand (State management)
- vitest (Unit testing)
- playwright (E2E testing, post-MVP)
- eslint, prettier (Linting/formatting)
- @testing-library/react (Component testing)

### 🔑 Environment Variables

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (if needed for server-side)
- OPENAI_API_KEY

### 🗂️ File/Folder Structure

```
/src
    /app
    /components
    /lib
    /styles
    /utils
```

### 👤 User Roles

- **Authenticated:** Can upload, analyze, view history, delete data
- **Unauthenticated:** Can access demo (view sample contract and analysis, no uploads)

### 🛡️ Error Handling & User Feedback

- All errors (file, AI, network) are surfaced to the user via shadcn/ui Alert components
- If file parsing or AI analysis fails, retry and notify the user with an Alert
- Rate limits (e.g., 5 uploads per user per hour) are enforced server-side and clearly communicated to the user via UI feedback

### ♿ Accessibility & Responsiveness

- All UI must be accessible (keyboard, screen reader) and mobile-friendly (responsive by default)

### 🧪 Testing

- All core logic/components must have Vitest unit tests
- All React components must have tests using @testing-library/react
- E2E tests with Playwright after MVP

### 🚀 Deployment

- Vercel deployment requires all environment variables to be set
- Supabase project must be provisioned before deploy

### 📊 Analytics/Monitoring

- Use Supabase logs for basic analytics and monitoring (keep simple for MVP)

### 🔒 Security & Privacy

- No sensitive data in logs
- User data deleted after 30 days or on user request
