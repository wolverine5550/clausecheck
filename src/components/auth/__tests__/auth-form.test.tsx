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

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../auth-form';
import * as supabaseClient from '@/lib/supabase-client';
import React from 'react';

// Helper to render the form
const renderForm = (mode: 'login' | 'signup' = 'login') => {
  return render(<AuthForm mode={mode} onAuthSuccess={vi.fn()} />);
};

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password fields', () => {
    renderForm();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('calls Supabase signUp on signup mode', async () => {
    renderForm('signup');
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect((supabaseClient as any).mockAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('calls Supabase signInWithPassword on login mode', async () => {
    renderForm('login');
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect((supabaseClient as any).mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
