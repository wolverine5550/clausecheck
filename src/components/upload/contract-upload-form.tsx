// ContractUploadForm: Modular upload form for contract files
// - Uses shadcn/ui components for form and feedback
// - Uses react-hook-form and zod for validation
// - Only allows PDF and DOC/DOCX files, max 10MB
// - Accepts props for onSuccess, onError for future reuse
// - To be used in /upload page and potentially dashboard/modal

'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// shadcn/ui components
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';
import { Alert } from '../ui/alert';

// Define allowed file types and max size
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Zod schema for file validation
const uploadSchema = z.object({
  file: z
    .custom<FileList>((v) => v instanceof FileList && v.length === 1, {
      message: 'Please select a file.',
    })
    .refine((v) => v && ALLOWED_TYPES.includes(v[0]?.type), {
      message: 'Only PDF, DOC, or DOCX files are allowed.',
    })
    .refine((v) => v && v[0]?.size <= MAX_SIZE, {
      message: 'File must be 10MB or less.',
    }),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface ContractUploadFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

// Type for API response
interface UploadApiResponse {
  success?: boolean;
  message: string;
  error?: string;
  warning?: string;
  fileUrl?: string;
  extracted?: boolean;
}

/**
 * ContractUploadForm
 * Modular upload form for contract files (PDF, DOC, DOCX, max 10MB).
 * Handles file selection, validation, and submit.
 * Restricts upload to authenticated users (to be handled via context or prop).
 * Accepts onSuccess and onError callbacks for flexible usage.
 */
export const ContractUploadForm: React.FC<ContractUploadFormProps> = ({ onSuccess, onError }) => {
  // Use Supabase useUser hook for authentication state
  const user = useUser();
  const isAuthenticated = !!user;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  // File input ref for dropzone
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for inline warning/alert
  const [inlineWarning, setInlineWarning] = React.useState<string | null>(null);
  const [inlineError, setInlineError] = React.useState<string | null>(null);

  // Handle form submit
  const onSubmit = async (data: UploadFormValues) => {
    setInlineWarning(null);
    setInlineError(null);
    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', data.file[0]);

      // Call the upload API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadApiResponse = await response.json();

      if (!response.ok) {
        // Handle rate limit error specifically
        if (response.status === 429) {
          toast({
            variant: 'destructive',
            title: 'Rate limit exceeded',
            description: result.message,
          });
        } else if (response.status === 401) {
          setInlineError('You must be signed in to upload.');
        } else if (response.status === 400) {
          setInlineError(result.message || 'No file uploaded.');
        } else {
          setInlineError(result.message || result.error || 'Failed to upload.');
        }
        if (onError) onError(new Error(result.error || result.message || 'Failed to upload'));
        return;
      }

      // Show extraction warning if present
      if (result.warning) {
        setInlineWarning(result.warning);
      }

      // Success toast
      toast({
        title: 'Success',
        description: result.message,
      });
      reset();
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload contract. Please try again.',
      });
      setInlineError('Failed to upload contract. Please try again.');
      if (onError) onError(error as Error);
    }
  };

  // Handle dropzone click
  const handleDropzoneClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Inline error alert */}
      {inlineError && (
        <Alert variant="destructive" className="mb-2">
          {inlineError}
        </Alert>
      )}
      {/* Inline warning alert (e.g., extraction warning) */}
      {inlineWarning && (
        <Alert variant="warning" className="mb-2">
          {inlineWarning}
        </Alert>
      )}
      {/* Dropzone for file selection */}
      <div
        className="border border-dashed rounded-lg p-8 text-center text-muted-foreground bg-muted cursor-pointer hover:bg-accent transition"
        onClick={handleDropzoneClick}
        tabIndex={0}
        role="button"
        aria-label="Select contract file"
      >
        <Label htmlFor="file" className="block mb-2 font-medium">
          Drag and drop a PDF, DOC, or DOCX file here, or click to select
        </Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          {...register('file')}
        />
        <span className="text-xs text-muted-foreground">Max file size: 10MB</span>
      </div>
      {/* Error message */}
      {errors.file && <div className="text-destructive text-sm mt-2">{errors.file.message}</div>}
      {/* Submit button */}
      <Button type="submit" disabled={!isAuthenticated || isSubmitting} className="w-full">
        {isAuthenticated ? 'Upload Contract' : 'Sign in to Upload'}
      </Button>
    </form>
  );
};
