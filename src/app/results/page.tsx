'use client';

// Results page for displaying analyzed contract clauses
// - Fetches contracts for the authenticated user
// - Allows selection of a contract
// - Displays all analyzed clauses for the selected contract
// - Uses ClauseCard and ClauseAccordion components
// - Responsive and accessible UI using shadcn/ui

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { ClauseCard } from '../../components/results/ClauseCard';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert } from '../../components/ui/alert';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { toast } from '../../components/ui/use-toast';

// Types for contract and clause
interface Contract {
  id: string;
  file_name: string;
  uploaded_at: string;
}

interface Clause {
  id: string;
  clause_text: string;
  risk_score: number;
  explanation: string;
  suggestion: string;
  clause_index: number;
}

const ResultsPage = () => {
  const user = useUser();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingClauses, setLoadingClauses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch contracts for the authenticated user
  useEffect(() => {
    if (!user) return;
    setLoadingContracts(true);
    setError(null);
    const supabase = createClientComponentClient();
    supabase
      .from('contracts')
      .select('id, file_name, uploaded_at')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to fetch contracts.');
          setContracts([]);
        } else {
          setContracts(data || []);
          if (data && data.length > 0) {
            setSelectedContractId(data[0].id);
          }
        }
        setLoadingContracts(false);
      });
  }, [user]);

  // Fetch analyzed clauses for the selected contract
  useEffect(() => {
    if (!selectedContractId) return;
    setLoadingClauses(true);
    setError(null);
    const supabase = createClientComponentClient();
    supabase
      .from('clauses')
      .select('id, clause_text, risk_score, explanation, suggestion, clause_index')
      .eq('contract_id', selectedContractId)
      .eq('analysis_status', 'complete')
      .order('clause_index', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to fetch analyzed clauses.');
          setClauses([]);
        } else {
          setClauses(data || []);
        }
        setLoadingClauses(false);
      });
  }, [selectedContractId]);

  // Delete contract handler
  const handleDeleteContract = async () => {
    if (!selectedContractId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contracts/${selectedContractId}/delete`, { method: 'POST' });
      const result = await res.json();
      if (!res.ok) {
        toast({
          variant: 'destructive',
          title: 'Delete failed',
          description: result.error || 'Failed to delete contract.',
        });
      } else {
        toast({
          title: 'Contract deleted',
          description: result.message,
        });
        // Refresh contracts list
        setContracts((prev) => prev.filter((c) => c.id !== selectedContractId));
        setSelectedContractId((prev) => {
          const remaining = contracts.filter((c) => c.id !== prev);
          return remaining.length > 0 ? remaining[0].id : null;
        });
        setClauses([]);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Delete error',
        description: 'Could not delete contract. Please try again.',
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <Alert variant="warning">You must be signed in to view results.</Alert>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Contract Analysis Results</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {loadingContracts ? (
        <Skeleton className="h-10 w-full mb-4" role="status" />
      ) : contracts.length === 0 ? (
        <Alert variant="info">No contracts uploaded yet.</Alert>
      ) : (
        <div className="mb-6">
          <label htmlFor="contract-select" className="block mb-2 font-medium">
            Select a contract:
          </label>
          <Select value={selectedContractId || ''} onValueChange={setSelectedContractId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a contract" />
            </SelectTrigger>
            <SelectContent>
              {contracts.map((contract) => (
                <SelectItem key={contract.id} value={contract.id}>
                  {contract.file_name} ({new Date(contract.uploaded_at).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {contracts.length > 0 && selectedContractId && (
        <div className="mb-4 flex justify-end">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                Delete Contract
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete Contract</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this contract? This action cannot be undone.
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteContract} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {loadingClauses ? (
        <>
          <Skeleton className="h-24 w-full mb-4" role="status" />
          <Skeleton className="h-24 w-full mb-4" role="status" />
        </>
      ) : clauses.length === 0 && selectedContractId ? (
        <Alert variant="info">No analyzed clauses found for this contract.</Alert>
      ) : (
        <div className="space-y-4">
          {clauses.map((clause) => (
            <ClauseCard
              key={clause.id}
              clauseText={clause.clause_text}
              riskScore={clause.risk_score}
              explanation={clause.explanation}
              suggestion={clause.suggestion}
            />
          ))}
        </div>
      )}
      {/* TODO: Add e2e/integration tests for this page */}
    </main>
  );
};

export default ResultsPage;
