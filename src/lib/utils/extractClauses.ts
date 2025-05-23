/**
 * Clause extraction utility for legal contracts.
 *
 * This function takes raw contract text and splits it into individual clauses.
 * For the MVP, splitting is done by paragraphs (double newlines) or numbered sections (e.g., 1., 2., 3.).
 *
 * Future improvements: Use more advanced NLP or regex for legal clause detection.
 *
 * @param rawText - The raw text of the contract (already extracted from PDF/DOCX)
 * @returns Array of Clause objects, each containing the clause text
 */

// Clause type definition
export interface Clause {
  clauseText: string;
}

/**
 * Splits raw contract text into clauses using simple heuristics.
 * - If numbered sections are found (e.g., '1. ', '2. '), split by those.
 * - Otherwise, split by double newlines (paragraphs).
 *
 * @param rawText - The raw contract text
 * @returns Array of Clause objects
 */
export function extractClauses(rawText: string): Clause[] {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Invalid input: rawText must be a non-empty string.');
  }

  // Try to split by numbered sections (e.g., 1. ... 2. ... 3. ...)
  const numberedSectionRegex = /(?:^|\n)(\d{1,2}\.[ \t]+)/g;
  const hasNumberedSections = numberedSectionRegex.test(rawText);

  let clauses: string[] = [];

  if (hasNumberedSections) {
    // Split by numbered section headers, but keep the header with the text
    clauses = rawText.split(/(?=\n?\d{1,2}\.[ \t]+)/g).map(s => s.trim()).filter(Boolean);
  } else {
    // Fallback: split by double newlines (paragraphs)
    clauses = rawText.split(/\n{2,}/g).map(s => s.trim()).filter(Boolean);
  }

  // Map to Clause objects
  return clauses.map(text => ({ clauseText: text }));
} 