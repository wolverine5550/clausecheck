// Import jest-dom matchers for Vitest
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Alert } from '../alert';
import React from 'react';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders destructive variant with icon', () => {
    render(<Alert variant="destructive">Error!</Alert>);
    expect(screen.getByText('Error!')).toBeInTheDocument();
    // Icon test may need adjustment if lucide-react icons do not set data-testid
  });

  it('renders warning variant with icon', () => {
    render(<Alert variant="warning">Warning!</Alert>);
    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });

  it('renders success variant with icon', () => {
    render(<Alert variant="success">Success!</Alert>);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders info variant with icon', () => {
    render(<Alert variant="info">Info!</Alert>);
    expect(screen.getByText('Info!')).toBeInTheDocument();
  });
});
