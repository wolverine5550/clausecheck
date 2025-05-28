// Upload page for contract files
// Visible to authenticated users only; unauthenticated users see an alert and demo/login options
// Uses modular ContractUploadForm component (src/components/upload/contract-upload-form.tsx)

'use client';

import React from 'react';
import { ContractUploadForm } from '../../components/upload/contract-upload-form';
import { useUser } from '@supabase/auth-helpers-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const UploadPage: React.FC = () => {
  const user = useUser();
  if (!user) {
    return (
      <main className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Upload a Contract</h1>
        <Alert variant="warning" className="mb-6">
          <span className="font-semibold">Sign in required:</span> You must be signed in to upload
          and analyze your own contracts.
        </Alert>
        <div className="flex flex-col gap-4">
          <Link href="/demo" passHref legacyBehavior>
            <Button asChild variant="secondary">
              <a>Try Demo Mode</a>
            </Button>
          </Link>
          <Link href="/auth/login" passHref legacyBehavior>
            <Button asChild variant="default">
              <a>Sign Up or Log In</a>
            </Button>
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Upload a Contract</h1>
      <ContractUploadForm />
    </main>
  );
};

export default UploadPage;
