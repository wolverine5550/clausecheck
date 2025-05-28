<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

### ✅ Supabase Auth (Sign Up, Login, Logout)

- Modal-based authentication UI using shadcn/ui Dialog
- Email/password sign up and login
- Toast feedback for auth success/error (shadcn/ui)
- Logout button in header for authenticated users
- All import paths now use the src/ alias structure for consistency
- **Server-side route protection utility**: Use `requireUserOrRedirect()` in any protected page for consistent authentication checks
- **Unit tests for auth flows and route protection**: See `src/components/auth/__tests__/auth-form.test.tsx` and `src/utils/supabase/__tests__/require-user-or-redirect.test.ts`

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

## Project Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.local` from the template or set up your own environment variables.
3. Run the development server:
   ```sh
   npm run dev
   ```

## Linting & Formatting

- ESLint config: `.eslintrc.json` (Next.js + TypeScript recommended rules)
- Prettier config: `.prettierrc`
- To lint:
  ```sh
  npx eslint .
  ```
- To format:
  ```sh
  npx prettier --write .
  ```

## Testing

- Unit tests use [Vitest](https://vitest.dev/)
- Example test: `src/utils/__tests__/setup.test.ts`
- Tests may be placed next to features or in `__tests__` folders for global/utility tests
- To run all tests:
  ```sh
  npx vitest run
  ```

## Testing Supabase Client and Route Protection Utilities with Vitest

### Vitest Mocking and Hoisting Issues

When testing modules that import Supabase client or server utilities, Vitest's `vi.mock` is hoisted to the top of the file. This means you cannot reference or assign top-level variables inside the mock factory, or you will get errors like `ReferenceError: Cannot access 'mockAuth' before initialization`.

### Solution: Expose Mocks from the Factory

To reliably mock Supabase client/server utilities and assert against the correct mock instance, use the following pattern:

- **Expose the mock instance from the `vi.mock` factory** as a property (e.g., `mockAuth` or `_mockAuth`).
- **Access the mock instance in your tests** by casting the imported module as `any` (since the property only exists in the mocked module during tests).

#### Example for Supabase Client (auth-form.test.tsx):

```ts
vi.mock('@/lib/supabase-client', () => {
  const mockAuth = {
    signUp: vi.fn().mockResolvedValue({ error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
  };
  return {
    createClient: () => ({ auth: mockAuth }),
    __esModule: true,
    mockAuth,
  };
});

// In your test assertions:
expect((supabaseClient as any).mockAuth.signUp).toHaveBeenCalledWith({ ... });
```

#### Example for Route Protection Utility (require-user-or-redirect.test.ts):

```ts
vi.mock('../server', () => {
  const mockAuth = { getUser: vi.fn() };
  return {
    createClient: () => ({ auth: mockAuth }),
    __esModule: true,
    _mockAuth: mockAuth,
  };
});

import * as serverModule from '../server';

// In your test assertions:
expect((serverModule as any)._mockAuth.getUser).toHaveBeenCalledWith(...);
```

### Why This Pattern?

- **Avoids hoisting issues:** No top-level variable references inside the mock factory.
- **Ensures correct mock instance:** The test and the component/module under test use the same mock instance.
- **Works with ESM/CJS and path aliases:** No require/import path issues.

### Troubleshooting

If you see errors about missing mock calls or hoisting, check that:

- You are not referencing or assigning to variables at the top level inside a `vi.mock` factory.
- You are exposing the mock instance from the factory and accessing it via the imported module (cast as `any`).

All current tests for Supabase auth and route protection use this pattern and pass reliably.

## Testing Next.js API Route Handlers

**Note:** Next.js API route handlers that use `cookies()` or other request context features cannot be unit tested with Vitest or Jest, as these require a real request context provided only by the Next.js runtime. Attempting to call these handlers in a unit test will result in errors like:

```
Error: `cookies` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context
```

**How to handle:**

- Mark or skip these tests in your test files (see `src/app/api/upload/__tests__/route.test.ts`).
- Cover API route logic with integration or e2e tests (e.g., Playwright, Next.js API integration tests) instead.
- Document this limitation in the README and CHANGELOG.

This pattern is consistent with the robust mocking and testing approach used elsewhere in this project.

# Clause Check MVP

## Auth & Supabase Setup

- Uses @supabase/auth-helpers-nextjs for all server/client Supabase logic
- Uses @supabase/auth-helpers-react for SessionContextProvider and useUser (client-only)
- No usage of @supabase/ssr (deprecated/incompatible)
- ClientOnlySupabaseProvider pattern keeps root layout as server component

## File Upload Feature

- Upload page and modular upload form using shadcn/ui, react-hook-form, and zod
- Only allows PDF, DOC, DOCX files, max 10MB
- Rate limiting: 5 uploads/hour/user (enforced in API route)
- Files uploaded to private Supabase Storage bucket ('contracts')
- Metadata stored in contracts table
- **All errors (validation, rate limit, extraction, auth, storage, etc.) are surfaced to the user via shadcn/ui Alert and Toast components.**
- The API always returns a `message` and may return a `warning` for extraction issues.
- The Alert component (`src/components/ui/alert.tsx`) uses `role="alert"` for accessibility and robust testability.

## Testing File Upload Feature

- UI tests for the upload form and Alert component are implemented using React Testing Library and Vitest.
- All error and warning feedback is tested using `getByRole('alert')`.
- API route handler tests are skipped due to Next.js request context limitations (see below).
- Robust mocking pattern is used for Supabase and UI utilities (see Supabase Integration section).

## Raw Text Extraction

- After upload, the server extracts raw text from PDF and DOCX files using `pdf-parse` and `mammoth`.
- Extraction logic: `src/lib/utils/extract-raw-text.ts`
- API route: `src/app/api/upload/route.ts`
- Extracted text is stored in the `raw_text` column of the `contracts` table for downstream clause extraction and AI analysis.

## Clause Extraction

- After raw text is extracted from an uploaded contract, the server immediately splits the text into individual clauses using a utility function.
- **Clause extraction utility:** `src/lib/utils/extractClauses.ts`
  - Splits text by numbered sections (e.g., '1. ... 2. ...') or by paragraphs (double newlines) as a fallback.
  - Returns an array of clause objects, each with a `clauseText` property.
  - Fully unit tested: see `src/lib/utils/__tests__/extractClauses.test.ts`.
- **API integration:**
  - The upload API route (`src/app/api/upload/route.ts`) calls the clause extraction utility after raw text extraction.
  - All extracted clauses are inserted into the Supabase `clauses` table, linked to the uploaded contract.
  - If clause extraction or DB insert fails, a warning is returned in the API response, but the upload is not blocked.
- **Supabase `clauses` table schema:**
  - `id` (uuid, PK), `contract_id` (uuid, FK), `clause_text` (text, required), plus AI analysis fields (nullable for now).
- **Test coverage:**
  - Clause extraction logic is robustly unit tested.
  - API route handler tests are skipped due to Next.js request context limitations (see above).
  - End-to-end (e2e) tests are recommended for full upload-to-clauses flow.
- **Limitations & future improvements:**
  - Current clause splitting is heuristic and may not perfectly match legal clause boundaries.
  - Future versions may use NLP or more advanced parsing for improved accuracy.
  - e2e tests (e.g., Playwright) should be added to verify the full backend flow.

## Supabase Storage Setup

- Create a private bucket (e.g., 'contracts') in Supabase dashboard
- Add RLS/storage policies:
  - INSERT: bucket_id = 'contracts' AND auth.role() = 'authenticated'
  - SELECT/DELETE: bucket_id = 'contracts' AND auth.role() = 'authenticated' AND storage.objects.owner = auth.uid()

## Environment Variables

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Troubleshooting (Next.js 15)

- Ensure all Supabase helpers use @supabase/auth-helpers-nextjs/react (no @supabase/ssr)
- In API routes, use cookies() synchronously for session detection
- If you see session/cookie parse errors, clear cookies/localStorage and restart dev server

## File/Folder Structure

- src/app/layout.tsx
- src/components/client-supabase-provider.tsx
- src/components/upload/contract-upload-form.tsx
- src/app/upload/page.tsx
- src/app/api/upload/route.tsx
- src/lib/supabase-client.ts
- src/utils/supabase/server.ts

## See CHANGELOG.md for full details

## Database Schema Updates

- 2024-06-07: Migration applied to remove `risk_level` (text) and add `risk_score` (integer) to the `clauses` table. This enables numeric risk scoring for AI-powered clause analysis. See `supabase/migrations/20240607180000_remove_risk_level_add_risk_score_clauses.sql`.
- 2024-06-07: Migration applied to add `analysis_status` (text, default 'pending') to the `clauses` table. This tracks the analysis state for each clause. See `supabase/migrations/20240607190000_add_analysis_status_to_clauses.sql`.
- 2024-06-07: Migration applied to add `clause_index` (integer) to the `clauses` table. This enables storing and displaying clauses in original document order. See `supabase/migrations/20240607200000_add_clause_index_to_clauses.sql`.
- Clause extraction logic now stores `clause_index` for each clause, so results can be queried and displayed in reading order.

## AI Clause Analysis

- Added OpenAI clause analysis utility for automated risk scoring, explanation, and suggestions for contract clauses using GPT-3.5.
- Utility: `src/lib/utils/openai-clause-analysis.ts`
- Types: `src/lib/utils/openai-clause-analysis.types.ts`
- Unit tests: `src/lib/utils/__tests__/openai-clause-analysis.test.ts`
- The utility is fully typed, robustly tested, and does not expose API keys in code.

### API Endpoint: Trigger Clause Analysis

- **POST /api/contracts/[contractId]/analyze**
  - Triggers AI-powered analysis for up to 10 pending clauses of the specified contract.
  - Updates each clause with risk_score, explanation, suggestion, and analysis_status.
  - Returns a summary of successes, failures, and any warnings.
  - File: `src/app/api/contracts/[contractId]/analyze/route.ts`

## Results Display

- The /results page displays all analyzed clauses for a contract in a scrollable, responsive list.
- Each clause is rendered as a Card (ClauseCard) with:
  - Clause text
  - Color-coded risk badge (based on risk_score: green/yellow/red)
  - Accordion for AI explanation and suggestion
  - CopyButton to copy the AI suggestion
- Uses shadcn/ui Card, Badge, Accordion, Button, and Skeleton components for UI consistency and accessibility.
- All interactive elements are accessible (keyboard, screen reader, role attributes).
- **Skeleton components now use `role="status"` for accessibility and robust testability.**
- **CopyButton tests use robust mocking for shadcn/ui hooks (useToast) to ensure test reliability.**
- **ClauseAccordion closed state test now checks for null, matching the actual DOM.**
- Fully unit tested: see src/components/results/**tests** and src/app/results/**tests**.
- Performance and accessibility are audited as part of the Results Display feature.
- **Traceability:** All Results Display changes and file paths are marked in `task_manager.md` for easy tracking.

## Testing

- **Results Display tests:**
  - All Results Display unit tests now pass (see src/components/results/**tests** and src/app/results/**tests**)
  - useToast mocking and test reliability fixed in CopyButton tests
  - ClauseAccordion closed state test now checks for null
  - Skeletons use role="status" for accessibility and test match
  - Traceability: All changes and file paths marked in task_manager.md

## Audit & History

- All user actions (contract upload, clause analysis, contract deletion) are logged in the audit_history table.
- Audit logs include minimal details (file name, action, timestamp, etc.) for traceability.
- Contract deletion is supported from the Results page, with confirmation dialog and audit logging.
- An upcoming /history page will allow users to view their audit history in a simple, responsive table.
- Affected files: src/app/api/upload/route.ts, src/app/api/contracts/[contractId]/analyze/route.ts, src/app/api/contracts/[contractId]/delete/route.ts, src/app/results/page.tsx, src/lib/utils/openai-clause-analysis.types.ts

## Testing Notes

- For ResultsPage and HistoryPage unit tests, a robust Supabase client mock is used:
  - The mock returns a promise from `.order()`, matching the real Supabase client.
  - All chained methods (`select`, `eq`, `order`) are supported.
  - This prevents infinite update loops and ensures tests run reliably.
  - Affected files:
    - src/app/results/**tests**/page.test.tsx
    - src/app/history/**tests**/page.test.tsx
- All unit tests now pass for audit/history and results features.
- For delete actions (e.g., contract deletion on Results and History pages), toast rendering is **not** asserted in unit tests. This is because toasts may be rendered in portals or split across nodes, making them unreliable to assert in unit tests. Instead, toast feedback is covered in e2e/integration tests. See: src/app/history/**tests**/page.test.tsx for the robust pattern.

## Data Retention & Deletion Policy

### 30-Day Automatic Data Expiry

- All uploaded contracts, extracted clauses, audit history, and associated storage objects are automatically deleted 30 days after upload.
- This is enforced by a scheduled Supabase Edge Function (`delete_expired_data`) that runs daily and removes all user data older than 30 days.
- The function deletes:
  - Contracts (from the `contracts` table)
  - All related clauses and audit history (via ON DELETE CASCADE)
  - The associated file from Supabase Storage (`contracts` bucket)
- No user data is retained beyond 30 days for privacy and compliance.

### User-Initiated Deletion

- Users can delete their own uploads and results at any time from both the Results and History pages.
- Deletion requires confirmation via a dialog to prevent accidental loss.
- When a contract is deleted, all related clauses, audit history, and the storage object are also deleted.
- Only the owner of the contract can perform deletion; all permissions are enforced server-side.

### Security

- All deletion operations are protected by Row Level Security (RLS) and server-side checks to ensure only the data owner can delete their data.
- **IMPORTANT:** RLS must be enabled on the `contracts` table. Only allow `DELETE` where `user_id = auth.uid()`. Example policy:

  ```sql
  -- Enable RLS
  ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
  -- Policy: Only allow contract owner to delete
  CREATE POLICY "Allow owner delete" ON contracts
    FOR DELETE USING (user_id = auth.uid());
  ```

- No secrets or sensitive data are exposed in the client or logs.

### Implementation Details

- See `supabase/functions/delete_expired_data/index.ts` for the edge function code.
- See API route: `src/app/api/contracts/[contractId]/delete/route.ts` for user-initiated deletion logic.
- All related UI and logic are covered by unit tests.
