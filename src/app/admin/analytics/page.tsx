'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ADMIN_EMAIL = 'apascar@gmail.com'; // TODO: Replace with your admin email

/**
 * Admin-only analytics dashboard for Clause Check MVP.
 * - Shows total uploads, analyses, deletes (from audit_history)
 * - Shows a table of recent actions
 * - Access is restricted to the admin email
 */
const AnalyticsPage: React.FC = () => {
  // Get the current user (client-side)
  const user = useUser();
  // State for analytics data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ uploads: 0, analyses: 0, deletes: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    // Only fetch if admin
    if (!user || user.email !== ADMIN_EMAIL) return;
    setLoading(true);
    setError(null);
    // Fetch audit_history from Supabase (client-side for MVP)
    // In production, use a server-side API route for security
    const fetchData = async () => {
      try {
        const supabase = (
          await import('@supabase/auth-helpers-nextjs')
        ).createClientComponentClient();
        // Get all audit_history rows
        const { data, error } = await supabase
          .from('audit_history')
          .select('*')
          .order('action_at', { ascending: false });
        if (error) throw error;
        // Calculate stats
        const uploads = data.filter((row: any) => row.action === 'upload').length;
        const analyses = data.filter((row: any) => row.action === 'analyze').length;
        const deletes = data.filter((row: any) => row.action === 'delete').length;
        setStats({ uploads, analyses, deletes });
        setRecent(data.slice(0, 20));
      } catch (err: any) {
        setError('Failed to fetch analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Not logged in or not admin
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <Alert variant="destructive">Access denied: Admins only.</Alert>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      {loading ? (
        <>
          <Skeleton className="h-8 w-1/3 mb-4" role="status" />
          <Skeleton className="h-32 w-full mb-6" role="status" />
        </>
      ) : (
        <>
          {/* Stats summary */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Card className="p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-muted-foreground">Uploads</div>
              <div className="text-2xl font-bold">{stats.uploads}</div>
            </Card>
            <Card className="p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-muted-foreground">Analyses</div>
              <div className="text-2xl font-bold">{stats.analyses}</div>
            </Card>
            <Card className="p-4 flex-1 min-w-[180px]">
              <div className="text-sm text-muted-foreground">Deletes</div>
              <div className="text-2xl font-bold">{stats.deletes}</div>
            </Card>
          </div>
          {/* Recent actions table */}
          <h2 className="text-lg font-semibold mb-2">Recent Actions</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.user_id}</TableCell>
                    <TableCell>{row.contract_id || '-'}</TableCell>
                    <TableCell>{new Date(row.action_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <pre className="whitespace-pre-wrap break-all text-xs bg-muted p-2 rounded">
                        {JSON.stringify(row.details, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </main>
  );
};

export default AnalyticsPage;
// End of admin-only analytics dashboard
