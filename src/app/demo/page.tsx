'use client';

// Demo page for unauthenticated users
// - Shows a sample contract and AI-powered clause analysis
// - All UI uses shadcn/ui components
// - Reuses ClauseCard and ClauseAccordion
// - No real uploads or API calls
// - Encourages user to sign up for full access

import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ClauseCard } from '@/components/results/ClauseCard';
import Link from 'next/link';

// Sample contract and clause analysis data for demo mode
interface DemoClause {
  clauseText: string;
  riskScore: number;
  explanation: string;
  suggestion: string;
}

const demoClauses: DemoClause[] = [
  {
    clauseText:
      '1. Confidentiality. The parties agree to keep all information exchanged under this Agreement strictly confidential and not to disclose it to any third party without prior written consent.',
    riskScore: 2,
    explanation: 'This is a standard confidentiality clause. No unusual or risky terms detected.',
    suggestion: 'No changes needed. Clause is clear and standard.',
  },
  {
    clauseText:
      '2. Termination. Either party may terminate this Agreement at any time, for any reason, with 24 hours written notice to the other party.',
    riskScore: 7,
    explanation:
      'The termination notice period is very short (24 hours), which may expose both parties to sudden contract end. This is riskier than typical (30 days).',
    suggestion: 'Consider increasing the notice period to at least 30 days for better protection.',
  },
  {
    clauseText:
      '3. Limitation of Liability. In no event shall either party be liable for any indirect, incidental, or consequential damages arising out of this Agreement.',
    riskScore: 5,
    explanation:
      'This clause limits liability for indirect damages, which is common, but may be unfavorable if you suffer losses not directly covered.',
    suggestion:
      'Clarify which damages are excluded and consider negotiating for more balanced terms.',
  },
];

const DemoPage: React.FC = () => {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      {/* Demo mode alert */}
      <Alert variant="info" className="mb-6">
        <span className="font-semibold">Demo Mode:</span> You are viewing a sample contract
        analysis. To upload and analyze your own contracts, please sign up or log in.
      </Alert>
      <h1 className="text-2xl font-bold mb-4">Demo: Sample Contract Analysis</h1>
      <p className="mb-8 text-base text-muted-foreground">
        This is a preview of Clause Check. Below is a sample contract with AI-powered clause
        analysis. Sign up to upload your own contracts and get instant, actionable insights.
      </p>
      {/* Demo contract card */}
      <Card className="p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Sample Contract</h2>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold">File name:</span> demo-contract.pdf
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-semibold">Uploaded:</span> (Demo Only)
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Clauses:</span> 3
        </p>
      </Card>
      {/* Render sample clause cards */}
      <section aria-label="Sample Clauses">
        {demoClauses.map((clause, idx) => (
          <ClauseCard
            key={idx}
            clauseText={clause.clauseText}
            riskScore={clause.riskScore}
            explanation={clause.explanation}
            suggestion={clause.suggestion}
          />
        ))}
      </section>
      {/* Call to action */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link href="/auth/login" passHref legacyBehavior>
          <Button asChild variant="default" size="lg">
            <a>Sign Up or Log In to Analyze Your Own Contract</a>
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default DemoPage;
