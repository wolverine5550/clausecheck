import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * API route for deleting a contract by contractId.
 * - Requires authentication
 * - Deletes the contract (cascades to clauses, etc.)
 * - Logs the action in audit_history
 * - Returns JSON response
 */
export async function POST(
  req: Request,
  context: { params: { contractId: string } }
) {
  try {
    // Authenticate user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractId = context.params.contractId;
    if (!contractId) {
      return NextResponse.json({ error: "Missing contractId" }, { status: 400 });
    }

    // Fetch contract metadata for audit log (file_name)
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('file_name')
      .eq('id', contractId)
      .single();
    if (fetchError || !contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Delete the contract (cascades to clauses, etc.)
    const { error: deleteError } = await supabase
      .from('contracts')
      .delete()
      .eq('id', contractId);
    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
    }

    // --- Audit log: record delete action ---
    // Insert a row into audit_history after successful contract deletion
    const auditLog = {
      user_id: user.id,
      contract_id: contractId,
      action: 'delete',
      details: {
        file_name: contract.file_name,
        deleted_at: new Date().toISOString(),
      },
    };
    // Insert audit log (do not block response on error)
    await supabase.from('audit_history').insert(auditLog);

    return NextResponse.json({ success: true, message: "Contract deleted." });
  } catch (error) {
    console.error("Delete contract error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 