import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { analyzeClauseWithOpenAI } from '@/lib/utils/openai-clause-analysis';

// Max number of clauses to analyze per contract
const CLAUSE_ANALYSIS_LIMIT = 10;

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

    // Fetch up to CLAUSE_ANALYSIS_LIMIT pending clauses for this contract
    const { data: clauses, error: fetchError } = await supabase
      .from('clauses')
      .select('id, clause_text')
      .eq('contract_id', contractId)
      .eq('analysis_status', 'pending')
      .limit(CLAUSE_ANALYSIS_LIMIT);

    if (fetchError) {
      return NextResponse.json({ error: "Failed to fetch clauses" }, { status: 500 });
    }
    if (!clauses || clauses.length === 0) {
      return NextResponse.json({ message: "No pending clauses to analyze." });
    }

    let analyzed = 0;
    let failed = 0;
    const warnings: string[] = [];

    // Analyze each clause sequentially (to avoid OpenAI rate limits)
    for (const clause of clauses) {
      try {
        // Set status to 'analyzing'
        await supabase.from('clauses').update({ analysis_status: 'analyzing' }).eq('id', clause.id);
        // Call OpenAI
        const result = await analyzeClauseWithOpenAI(clause.clause_text);
        // Update clause with analysis results
        await supabase.from('clauses').update({
          risk_score: result.risk_score,
          explanation: result.explanation,
          suggestion: result.suggestion,
          analysis_status: 'complete',
          analyzed_at: new Date().toISOString(),
        }).eq('id', clause.id);
        analyzed++;
      } catch (err: any) {
        // On error, set status to 'error', leave analysis fields null
        await supabase.from('clauses').update({
          analysis_status: 'error',
        }).eq('id', clause.id);
        failed++;
        warnings.push(`Clause ${clause.id}: ${err.message || err}`);
      }
    }

    // --- Audit log: record analyze action ---
    // Insert a row into audit_history after successful batch analysis
    const auditLog = {
      user_id: user.id,
      contract_id: contractId,
      action: 'analyze',
      details: {
        analyzed,
        failed,
        warnings,
      },
    };
    // Insert audit log (do not block response on error)
    await supabase.from('audit_history').insert(auditLog);

    return NextResponse.json({
      message: `Analysis complete. ${analyzed} succeeded, ${failed} failed.`,
      analyzed,
      failed,
      warnings: warnings.length ? warnings : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
} 