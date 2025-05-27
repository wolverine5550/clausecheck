import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// Mock useUser to return a test user
vi.mock('@supabase/auth-helpers-react', () => ({ useUser: () => ({ id: 'user-1' }) }));
// Robust Supabase client mock for HistoryPage
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockThen = vi.fn();
const mockSupabase = {
  from: mockFrom,
};
mockFrom.mockReturnValue({ select: mockSelect });
mockSelect.mockReturnValue({ eq: mockEq });
mockEq.mockReturnValue({ order: mockOrder });
mockOrder.mockImplementation(() => ({
  then: (cb: any) => {
    // Simulate error for audit_history fetch, success for contracts fetch
    cb({ data: null, error: 'fail' });
    return Promise.resolve();
  },
}));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}));

// Import after mocks
import HistoryPage from '../page';

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeletons', () => {
    // Simulate loading state by not resolving the promise
    render(<HistoryPage />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('shows empty state if no audit rows', async () => {
    mockOrder.mockImplementationOnce(() => ({
      then: (cb: any) => {
        cb({ data: [], error: null });
        return Promise.resolve();
      },
    }));
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText(/no audit history found/i)).toBeInTheDocument();
    });
  });

  it('shows error alert if fetch fails', async () => {
    mockOrder.mockImplementationOnce(() => ({
      then: (cb: any) => {
        cb({ data: null, error: 'fail' });
        return Promise.resolve();
      },
    }));
    render(<HistoryPage />);
    await waitFor(() => {
      // Find the alert with the error text
      const alerts = screen.getAllByRole('alert');
      const errorAlert = alerts.find((el) =>
        el.textContent?.toLowerCase().includes('failed to fetch'),
      );
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(/failed to fetch/i);
    });
  });

  it('renders audit rows in table', async () => {
    mockOrder.mockImplementationOnce(() => ({
      then: (cb: any) => {
        cb({
          data: [
            {
              id: '1',
              action: 'upload',
              action_at: new Date().toISOString(),
              details: { file_name: 'test.pdf' },
              contract_id: 'c1',
            },
          ],
          error: null,
        });
        return Promise.resolve();
      },
    }));
    render(<HistoryPage />);
    await waitFor(() => {
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
      expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    });
  });
});
