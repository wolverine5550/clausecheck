// /history page: Displays the current user's audit history in a responsive table
// Uses shadcn/ui components for alerts and loading states

'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Alert } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';

interface AuditRow {
  id: string;
  action: string;
  action_at: string;
  details: any;
  contract_id?: string;
}

interface ContractMap {
  [id: string]: string; // contract_id -> file_name
}

const HistoryPage = () => {
  const user = useUser();
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [contractMap, setContractMap] = useState<ContractMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch audit history and contract file names
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const supabase = createClientComponentClient();
    Promise.all([
      supabase
        .from('audit_history')
        .select('id, action, action_at, details, contract_id')
        .eq('user_id', user.id)
        .order('action_at', { ascending: false }),
      supabase.from('contracts').select('id, file_name').eq('user_id', user.id),
    ])
      .then(([auditRes, contractsRes]) => {
        if (auditRes.error) {
          setError('Failed to fetch audit history.');
          setAuditRows([]);
        } else {
          setAuditRows(auditRes.data || []);
        }
        if (contractsRes.error) {
          setContractMap({});
        } else {
          const map: ContractMap = {};
          (contractsRes.data || []).forEach((c: any) => {
            map[c.id] = c.file_name;
          });
          setContractMap(map);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch audit history.');
        setAuditRows([]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <Alert variant="warning">You must be signed in to view your history.</Alert>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Audit History</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {loading ? (
        <>
          <Skeleton className="h-10 w-full mb-4" role="status" />
          <Skeleton className="h-10 w-full mb-4" role="status" />
        </>
      ) : auditRows.length === 0 ? (
        <Alert variant="info">No audit history found.</Alert>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Contract</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-2 font-medium">{row.action}</td>
                  <td className="px-4 py-2">
                    {row.contract_id ? contractMap[row.contract_id] || row.contract_id : '-'}
                  </td>
                  <td className="px-4 py-2">{new Date(row.action_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {row.details && typeof row.details === 'object' ? (
                      <pre className="whitespace-pre-wrap break-all text-xs bg-muted p-2 rounded">
                        {JSON.stringify(row.details, null, 2)}
                      </pre>
                    ) : (
                      String(row.details || '-')
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
