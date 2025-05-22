// Upload page for contract files
// Visible to all users, but upload restricted to authenticated users
// Uses modular ContractUploadForm component (to be implemented in src/components/upload/contract-upload-form.tsx)

'use client';

import React from 'react';
import { ContractUploadForm } from '../../components/upload/contract-upload-form';

const UploadPage = () => {
  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Upload a Contract</h1>
      <ContractUploadForm />
    </main>
  );
};

export default UploadPage;
