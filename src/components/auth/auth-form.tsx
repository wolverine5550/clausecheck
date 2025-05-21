'use client';

import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '../../lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

// Zod schema for auth form validation
const AuthSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type AuthFormData = z.infer<typeof AuthSchema>;

type AuthFormProps = {
  mode: 'login' | 'signup';
  onAuthSuccess?: () => void;
};

/**
 * AuthForm handles both login and signup flows using Supabase Auth.
 * Uses shadcn/ui components, react-hook-form, and zod for validation.
 *
 * @param mode - 'login' or 'signup'
 * @param onAuthSuccess - callback for successful auth
 */
export function AuthForm({ mode, onAuthSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(AuthSchema),
  });
  const { toast } = useToast();

  // Handles form submission for login or signup
  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    const supabase = createClient();
    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
    }
    setLoading(false);
    if (result.error) {
      toast({
        title: 'Authentication Error',
        description: result.error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: mode === 'signup' ? 'Sign Up Successful' : 'Login Successful',
        description:
          mode === 'signup'
            ? 'Check your email for a confirmation link.'
            : 'You are now logged in.',
      });
      onAuthSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        {...register('email')}
        disabled={loading}
        aria-invalid={!!errors.email}
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      <Input
        type="password"
        placeholder="Password"
        {...register('password')}
        disabled={loading}
        aria-invalid={!!errors.password}
      />
      {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? mode === 'signup'
            ? 'Signing Up...'
            : 'Logging In...'
          : mode === 'signup'
            ? 'Sign Up'
            : 'Log In'}
      </Button>
    </form>
  );
}
