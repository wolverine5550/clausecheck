import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultsPage from '../page';

// Mock useUser and Supabase client
vi.mock('@supabase/auth-helpers-react', () => ({ useUser: () => ({ id: 'user1' }) }));
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
      eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    }),
  }),
}));

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
