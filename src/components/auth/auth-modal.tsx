'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AuthForm } from './auth-form';
import { Button } from '../ui/button';

/**
 * AuthModal provides a modal dialog for user authentication (login/signup).
 * Uses shadcn/ui Dialog and AuthForm. Allows switching between login and signup modes.
 */
export function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Switches between login and signup modes
  const toggleMode = () => setMode((m) => (m === 'login' ? 'signup' : 'login'));

  // Closes modal and resets mode
  const handleClose = () => {
    setOpen(false);
    setMode('login');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{mode === 'login' ? 'Sign In' : 'Sign Up'}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Sign In' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        <AuthForm mode={mode} onAuthSuccess={handleClose} />
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:underline"
            onClick={toggleMode}
            tabIndex={0}
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
