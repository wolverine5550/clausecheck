import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoPage from '../page';
import '@testing-library/jest-dom';

describe('DemoPage', () => {
  it('renders the demo alert and heading', () => {
    render(<DemoPage />);
    expect(screen.getByText(/Demo Mode:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Demo: Sample Contract Analysis/i }),
    ).toBeInTheDocument();
  });

  it('renders the sample contract card', () => {
    render(<DemoPage />);
    expect(screen.getByText(/File name:/i)).toBeInTheDocument();
    expect(screen.getByText(/demo-contract.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/Clauses:/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders all ClauseCards with correct risk labels', () => {
    render(<DemoPage />);
    // There should be 3 ClauseCards
    expect(screen.getAllByLabelText(/Contract clause card/i)).toHaveLength(3);
    // Check for risk labels
    expect(screen.getByLabelText(/Low Risk/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Medium Risk/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/High Risk/i)).toBeInTheDocument();
  });

  it('renders the call-to-action button to login/signup', () => {
    render(<DemoPage />);
    const cta = screen.getByRole('link', {
      name: /Sign Up or Log In to Analyze Your Own Contract/i,
    });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/auth/login');
  });

  it('is accessible: ClauseCards have aria-labels', () => {
    render(<DemoPage />);
    const cards = screen.getAllByLabelText(/Contract clause card/i);
    expect(cards.length).toBeGreaterThan(0);
  });
});
