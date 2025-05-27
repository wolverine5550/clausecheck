import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock useUser to return a test user
vi.mock('@supabase/auth-helpers-react', () => ({ useUser: () => ({ id: 'user-1' }) }));
// Mock toast
vi.mock('../../../components/ui/use-toast', () => ({ toast: vi.fn() }));
// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Persistent chain object for all Supabase method chains
const chain: any = {};
chain.select = () => chain;
chain.eq = () => chain;
chain.order = (...args: any[]) => {
  // If fetching contracts
  if (args[0] && args[0].includes('uploaded_at')) {
    return Promise.resolve({
      data: [{ id: 'c1', file_name: 'Test Contract', uploaded_at: new Date().toISOString() }],
      error: null,
    });
  } else {
    // If fetching clauses
    return Promise.resolve({
      data: [
        {
          id: 'cl1',
          clause_text: 'Clause 1',
          risk_score: 5,
          explanation: 'Explanation',
          suggestion: 'Suggestion',
          clause_index: 0,
        },
      ],
      error: null,
    });
  }
};

const mockFrom = vi.fn();
const mockSupabase = {
  from: mockFrom,
};
mockFrom.mockReturnValue(chain);

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}));

// Import after mocks
import ResultsPage from '../page';

describe('ResultsPage', () => {
  it('renders heading', () => {
    render(<ResultsPage />);
    expect(screen.getByText(/contract analysis results/i)).toBeInTheDocument();
  });

  it('shows loading skeletons', () => {
    render(<ResultsPage />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  // More tests can be added for contract select, ClauseCard rendering, empty/error states, etc.
  // For full coverage, use integration/e2e tests with real Supabase data.
});

describe('ResultsPage - Delete Button & Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens and closes the delete dialog', async () => {
    render(<ResultsPage />);
    // Open dialog
    const deleteBtn = await screen.findByRole('button', { name: /delete contract/i });
    fireEvent.click(deleteBtn);
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    // Close dialog
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByText(/are you sure you want to delete/i)).not.toBeInTheDocument();
    });
  });

  it('disables delete button while deleting and shows toast on success', async () => {
    // Mock fetch to resolve successfully
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Contract deleted.' }),
    });
    render(<ResultsPage />);
    // Open dialog
    const deleteBtn = await screen.findByRole('button', { name: /delete contract/i });
    fireEvent.click(deleteBtn);
    // Confirm delete
    const confirmBtn = screen.getByRole('button', { name: /delete$/i });
    fireEvent.click(confirmBtn);
    // Button should show 'Deleting...' and be disabled
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
      expect(confirmBtn).toHaveTextContent(/deleting/i);
    });
    // Toast should be called (mocked)
    const { toast } = await import('../../../components/ui/use-toast');
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Contract deleted' }));
    });
  });

  it('shows error toast if delete fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) });
    render(<ResultsPage />);
    // Open dialog
    const deleteBtn = await screen.findByRole('button', { name: /delete contract/i });
    fireEvent.click(deleteBtn);
    // Confirm delete
    const confirmBtn = screen.getByRole('button', { name: /delete$/i });
    fireEvent.click(confirmBtn);
    // Toast should be called with error
    const { toast } = await import('../../../components/ui/use-toast');
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    });
  });
});
