/**
 * The result returned from OpenAI clause analysis.
 */
export interface OpenAIClauseAnalysisResult {
  /**
   * Numeric risk score for the clause (1-10, 10 = highest risk)
   */
  risk_score: number;
  /**
   * Explanation of the risk assessment
   */
  explanation: string;
  /**
   * Suggestion for improving or mitigating the clause
   */
  suggestion: string;
}

/**
 * AuditHistory type for audit/history table rows.
 * Used for type safety when inserting audit logs.
 */
export interface AuditHistory {
  id?: string;
  user_id: string;
  contract_id?: string;
  clause_id?: string;
  action: 'upload' | 'analyze' | 'delete';
  action_at?: string;
  details?: Record<string, any>;
} 