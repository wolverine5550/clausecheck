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