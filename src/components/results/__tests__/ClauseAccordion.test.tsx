import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClauseAccordion } from '../ClauseAccordion';

/**
 * Unit tests for ClauseAccordion component
 */
describe('ClauseAccordion', () => {
  const baseProps = {
    explanation: 'This clause is standard.',
    suggestion: 'No changes needed.',
  };

  it('renders explanation and suggestion', () => {
    render(<ClauseAccordion {...baseProps} />);
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    fireEvent.click(trigger);
    expect(screen.getByText(/this clause is standard/i)).toBeInTheDocument();
    expect(screen.getByText(/no changes needed/i)).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ClauseAccordion {...baseProps}>
        <button>Extra Action</button>
      </ClauseAccordion>,
    );
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    fireEvent.click(trigger);
    expect(screen.getByText(/extra action/i)).toBeInTheDocument();
  });

  it('accordion opens and closes on trigger', () => {
    render(<ClauseAccordion {...baseProps} />);
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    // Initially closed
    expect(screen.queryByText(/this clause is standard/i)).toBeNull();
    // Open
    fireEvent.click(trigger);
    expect(screen.getByText(/this clause is standard/i)).toBeVisible();
    // Close
    fireEvent.click(trigger);
    expect(screen.queryByText(/this clause is standard/i)).toBeNull();
  });

  // Accessibility: trigger and content have correct roles/labels
  it('is accessible', () => {
    render(<ClauseAccordion {...baseProps} />);
    const trigger = screen.getByRole('button', { name: /ai analysis/i });
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByText(/this clause is standard/i)).toBeInTheDocument();
  });
});
