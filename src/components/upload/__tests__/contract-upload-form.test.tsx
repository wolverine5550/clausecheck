import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

// Always mock useUser to return authenticated user by default
vi.mock('@supabase/auth-helpers-react', () => ({ useUser: () => ({ id: 'user-1' }) }));
// Mock toast
vi.mock('../../ui/use-toast', () => ({ toast: vi.fn() }));
// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContractUploadForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation error if no file is selected', async () => {
    const { ContractUploadForm } = await import('../contract-upload-form');
    render(<ContractUploadForm />);
    const submitButton = screen
      .getAllByRole('button')
      .find((btn) => (btn as HTMLButtonElement).type === 'submit');
    fireEvent.submit(submitButton!);
    expect(await screen.findByText(/please select a file/i)).toBeInTheDocument();
  });

  it('shows error Alert if API returns 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });
    const { ContractUploadForm } = await import('../contract-upload-form');
    render(<ContractUploadForm />);
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/drag and drop/i);
    await userEvent.upload(input, file);
    const submitButton = screen
      .getAllByRole('button')
      .find((btn) => (btn as HTMLButtonElement).type === 'submit');
    fireEvent.submit(submitButton!);
    // Use getByRole('alert') for semantic check
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/you must be signed in to upload/i);
  });

  it('shows warning Alert if API returns warning', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Uploaded', warning: 'Extraction failed' }),
    });
    const { ContractUploadForm } = await import('../contract-upload-form');
    render(<ContractUploadForm />);
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/drag and drop/i);
    await userEvent.upload(input, file);
    const submitButton = screen
      .getAllByRole('button')
      .find((btn) => (btn as HTMLButtonElement).type === 'submit');
    fireEvent.submit(submitButton!);
    // Use getByRole('alert') for semantic check
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/extraction failed/i);
  });

  it('calls onSuccess on successful upload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Uploaded' }),
    });
    const { ContractUploadForm } = await import('../contract-upload-form');
    const onSuccess = vi.fn();
    render(<ContractUploadForm onSuccess={onSuccess} />);
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/drag and drop/i);
    await userEvent.upload(input, file);
    const submitButton = screen
      .getAllByRole('button')
      .find((btn) => (btn as HTMLButtonElement).type === 'submit');
    fireEvent.submit(submitButton!);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('disables submit button when not authenticated', async () => {
    // Reset modules and mock useUser to return null for this test only
    vi.resetModules();
    vi.doMock('@supabase/auth-helpers-react', () => ({ useUser: () => null }));
    const { ContractUploadForm } = await import('../contract-upload-form');
    render(<ContractUploadForm />);
    const submitButton = screen
      .getAllByRole('button')
      .find((btn) => (btn as HTMLButtonElement).type === 'submit');
    expect(submitButton).toBeDisabled();
  });
});
