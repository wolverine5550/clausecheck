import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as useToastModule from '../../ui/use-toast';
import { CopyButton } from '../CopyButton';

// Default mock useToast for tests that don't check toast calls
const mockToast = vi.fn();
const mockDismiss = vi.fn();
const mockToasts: any[] = [];
vi.spyOn(useToastModule, 'useToast').mockReturnValue({
  toast: mockToast,
  dismiss: mockDismiss,
  toasts: mockToasts,
});

describe('CopyButton', () => {
  const text = 'Copy this text!';
  let originalClipboard: any;

  beforeEach(() => {
    originalClipboard = { ...global.navigator.clipboard };
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
    mockToast.mockClear();
  });

  afterEach(() => {
    Object.defineProperty(global.navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });

  it('renders button', () => {
    render(<CopyButton text={text} />);
    expect(screen.getByRole('button', { name: /copy suggestion/i })).toBeInTheDocument();
  });

  it('copies text to clipboard on click', async () => {
    render(<CopyButton text={text} />);
    const button = screen.getByRole('button', { name: /copy suggestion/i });
    fireEvent.click(button);
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(text);
  });

  it('shows success toast on copy', async () => {
    const toast = vi.fn();
    vi.spyOn(useToastModule, 'useToast').mockReturnValue({
      toast,
      dismiss: mockDismiss,
      toasts: mockToasts,
    });
    render(<CopyButton text={text} />);
    const button = screen.getByRole('button', { name: /copy suggestion/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Copied!' }));
  });

  it('shows error toast on failure', async () => {
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('fail')),
      },
      configurable: true,
    });
    const toast = vi.fn();
    vi.spyOn(useToastModule, 'useToast').mockReturnValue({
      toast,
      dismiss: mockDismiss,
      toasts: mockToasts,
    });
    render(<CopyButton text={text} />);
    const button = screen.getByRole('button', { name: /copy suggestion/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
  });

  // Accessibility: button has correct role/label
  it('is accessible', () => {
    render(<CopyButton text={text} />);
    expect(screen.getByRole('button', { name: /copy suggestion/i })).toBeInTheDocument();
  });
});
