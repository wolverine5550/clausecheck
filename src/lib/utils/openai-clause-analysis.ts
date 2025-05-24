import type { OpenAIClauseAnalysisResult } from './openai-clause-analysis.types.ts';

/**
 * Calls the OpenAI API (GPT-3.5) to analyze a contract clause.
 * Returns a numeric risk_score, explanation, and suggestion for the clause.
 *
 * @param clauseText - The text of the clause to analyze
 * @returns Promise<OpenAIClauseAnalysisResult>
 */
export async function analyzeClauseWithOpenAI(clauseText: string): Promise<OpenAIClauseAnalysisResult> {
  // Ensure the API key is set in the environment
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not set in environment variables.');
  }

  // Construct the prompt for clause analysis
  const prompt = `Analyze the following contract clause for legal risk. Respond in JSON with keys: risk_score (integer 1-10, 10=highest risk), explanation (string), suggestion (string).\n\nClause: ${clauseText}`;

  // Call the OpenAI API (GPT-3.5)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a legal contract analysis assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 256,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from OpenAI API.');
  }

  // Parse the JSON response from the model
  let result: OpenAIClauseAnalysisResult;
  try {
    result = JSON.parse(content);
  } catch (err) {
    throw new Error('Failed to parse OpenAI response as JSON.');
  }

  // Validate the result
  if (
    typeof result.risk_score !== 'number' ||
    typeof result.explanation !== 'string' ||
    typeof result.suggestion !== 'string'
  ) {
    throw new Error('OpenAI response missing required fields.');
  }

  return result;
} 