import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock useUser and Supabase client
const ADMIN_EMAIL = 'apascar@gmail.com';
const mockUseUser = vi.fn();
vi.mock('@supabase/auth-helpers-react', () => ({ useUser: () => mockUseUser() }));
const mockFrom = vi.fn();
const mockSupabase = { from: mockFrom };
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}));

// Import the page (after mocks)
let AnalyticsPage: React.FC;
beforeAll(async () => {
  AnalyticsPage = (await import('../page')).default;
});

describe('Admin Analytics Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders access denied for non-admin', () => {
    mockUseUser.mockReturnValue({ email: 'not-admin@example.com' });
    render(<AnalyticsPage />);
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('renders stats and table for admin', async () => {
    mockUseUser.mockReturnValue({ email: ADMIN_EMAIL });
    // Mock Supabase data
    mockFrom.mockReturnValue({
      select: () => ({
        order: () =>
          Promise.resolve({
            data: [
              {
                id: '1',
                action: 'upload',
                user_id: 'u1',
                contract_id: 'c1',
                action_at: new Date().toISOString(),
                details: { file: 'a.pdf' },
              },
              {
                id: '2',
                action: 'analyze',
                user_id: 'u2',
                contract_id: 'c2',
                action_at: new Date().toISOString(),
                details: { count: 3 },
              },
              {
                id: '3',
                action: 'delete',
                user_id: 'u1',
                contract_id: 'c1',
                action_at: new Date().toISOString(),
                details: { reason: 'test' },
              },
            ],
            error: null,
          }),
      }),
    });
    render(<AnalyticsPage />);
    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    expect(screen.getByText(/uploads/i)).toBeInTheDocument();
    expect(screen.getByText(/analyses/i)).toBeInTheDocument();
    expect(screen.getByText(/deletes/i)).toBeInTheDocument();
    expect(screen.getByText('upload')).toBeInTheDocument();
    expect(screen.getByText('analyze')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
  });

  it('shows error alert if fetch fails', async () => {
    mockUseUser.mockReturnValue({ email: ADMIN_EMAIL });
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: 'fail' }),
      }),
    });
    render(<AnalyticsPage />);
    await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());
  });

  it('shows loading skeletons', () => {
    mockUseUser.mockReturnValue({ email: ADMIN_EMAIL });
    // Don't resolve the promise yet
    mockFrom.mockReturnValue({
      select: () => ({
        order: () => new Promise(() => {}),
      }),
    });
    render(<AnalyticsPage />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });
});
