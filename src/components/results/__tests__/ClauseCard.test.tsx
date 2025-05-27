import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClauseCard } from '../ClauseCard';

/**
 * Unit tests for ClauseCard component
 */
describe('ClauseCard', () => {
  const baseProps = {
    clauseText: 'This is a test clause.',
    explanation: 'This clause is standard.',
    suggestion: 'No changes needed.',
  };

  it('renders clause text', () => {
    render(<ClauseCard {...baseProps} riskScore={2} />);
    expect(screen.getByText(/this is a test clause/i)).toBeInTheDocument();
  });

  it('renders low risk badge', () => {
    render(<ClauseCard {...baseProps} riskScore={2} />);
    expect(screen.getByLabelText(/low risk/i)).toBeInTheDocument();
  });

  it('renders medium risk badge', () => {
    render(<ClauseCard {...baseProps} riskScore={5} />);
    expect(screen.getByLabelText(/medium risk/i)).toBeInTheDocument();
  });

  it('renders high risk badge', () => {
    render(<ClauseCard {...baseProps} riskScore={9} />);
    expect(screen.getByLabelText(/high risk/i)).toBeInTheDocument();
  });

  it('renders explanation and suggestion in accordion', () => {
    render(<ClauseCard {...baseProps} riskScore={2} />);
    // Open accordion
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    fireEvent.click(trigger);
    expect(screen.getByText(/this clause is standard/i)).toBeInTheDocument();
    expect(screen.getByText(/no changes needed/i)).toBeInTheDocument();
  });

  it('renders CopyButton', () => {
    render(<ClauseCard {...baseProps} riskScore={2} />);
    // Open accordion
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: /copy suggestion/i })).toBeInTheDocument();
  });

  // Accessibility: card, badge, accordion, and button have correct roles/labels
  it('is accessible', () => {
    render(<ClauseCard {...baseProps} riskScore={2} />);
    expect(screen.getByLabelText(/contract clause card/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/low risk/i)).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: /copy suggestion/i })).toBeInTheDocument();
  });
});
