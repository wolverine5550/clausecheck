# Changelog

## [Unreleased]

### Added

- Installed missing dependencies: @shadcn/ui, react-hook-form, zod, zustand, eslint, vitest, @testing-library/react, @types/jest
- Added ESLint config (.eslintrc.json) with Next.js/TypeScript recommended rules
- Added Prettier config (.prettierrc)
- Added Vitest config (vitest.config.ts) and a sample test (src/utils/**tests**/setup.test.ts)
- Updated Vitest config to support **tests** folders for global/utility tests
- Updated README.md with setup, linting, and testing instructions
- Supabase Auth (Sign Up, Login, Logout) with modal UI using shadcn/ui Dialog
- Toast feedback system (shadcn/ui) for auth flows
- Logout button in header for authenticated users
- Utility for server-side route protection: `requireUserOrRedirect` in `src/utils/supabase/require-user-or-redirect.ts`
- Updated protected page to use new utility: `src/app/protected/page.tsx`
- Unit tests for AuthForm: `src/components/auth/__tests__/auth-form.test.tsx`
- Unit tests for route protection utility: `src/utils/supabase/__tests__/require-user-or-redirect.test.ts`
- Tests cover form validation, Supabase logic, and server-side route protection
- File upload page and modular upload form with shadcn/ui, react-hook-form, and zod validation.
- Supabase Storage integration for contract uploads (private 'contracts' bucket).
- Rate limiting (5 uploads/hour/user) in API route.
- Toast feedback for upload success/error.
- ClientOnlySupabaseProvider wrapper to keep root layout as server component.
- RLS/storage policies for contracts bucket.

### Changed

- Integrated SessionContextProvider and useUser from @supabase/auth-helpers-react for client-side auth state.
- All Supabase client/server utilities now use @supabase/auth-helpers-nextjs (no @supabase/ssr).
- API route authentication/session handling updated for Next.js 15 (cookies() sync).
- File input registration fixed for react-hook-form compatibility.

### Removed

- All usage of @supabase/ssr (now deprecated/incompatible with helpers).

### Files Changed

- src/app/layout.tsx
- src/components/client-supabase-provider.tsx
- src/components/upload/contract-upload-form.tsx
- src/app/upload/page.tsx
- src/app/api/upload/route.ts
- src/lib/supabase-client.ts
- src/utils/supabase/server.ts
- Supabase dashboard: storage bucket and RLS policies

### Fixed

- All import paths and type issues for new src/ alias structure
- Fixed Vitest mocking and hoisting issues in unit tests for Supabase client and route protection utilities.
- Updated `src/components/auth/__tests__/auth-form.test.tsx` to expose the Supabase client mock instance from the `vi.mock` factory and assert against it using `(supabaseClient as any).mockAuth`. This ensures the test assertions use the same mock instance as the component under test, avoiding issues where new mock instances are created and not called by the component.
- Updated `src/utils/supabase/__tests__/require-user-or-redirect.test.ts` to expose the mock instance as `_mockAuth` from the `vi.mock` factory and access it in tests via `(serverModule as any)._mockAuth`. This avoids all top-level variable hoisting issues and ensures the test always uses the correct mock instance.
- These changes resolve errors caused by Vitest's hoisting of `vi.mock` and the inability to reference or assign top-level variables inside the mock factory. The new pattern is robust for ESM/CJS and path alias environments.
