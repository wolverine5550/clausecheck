import { describe, it, expect } from 'vitest';
import { extractClauses, Clause } from '../extractClauses';

/**
 * Unit tests for extractClauses utility.
 * Covers splitting by numbered sections, paragraphs, and error handling.
 */
describe('extractClauses', () => {
  it('splits text by numbered sections (e.g., 1. 2. 3.)', () => {
    const input = `1. First clause text.\nSome more details.\n2. Second clause text.\n3. Third clause.`;
    const result = extractClauses(input);
    expect(result).toEqual<Clause[]>([
      { clauseText: '1. First clause text.\nSome more details.' },
      { clauseText: '2. Second clause text.' },
      { clauseText: '3. Third clause.' },
    ]);
  });

  it('splits text by double newlines (paragraphs) if no numbered sections', () => {
    const input = `This is the first paragraph.\n\nThis is the second paragraph.\n\nThis is the third paragraph.`;
    const result = extractClauses(input);
    expect(result).toEqual<Clause[]>([
      { clauseText: 'This is the first paragraph.' },
      { clauseText: 'This is the second paragraph.' },
      { clauseText: 'This is the third paragraph.' },
    ]);
  });

  it('trims whitespace and filters out empty clauses', () => {
    const input = `\n\n1. First clause.\n\n\n2. Second clause.\n\n\n`;
    const result = extractClauses(input);
    expect(result).toEqual<Clause[]>([
      { clauseText: '1. First clause.' },
      { clauseText: '2. Second clause.' },
    ]);
  });

  it('throws an error if input is not a string', () => {
    // @ts-expect-error
    expect(() => extractClauses(null)).toThrow();
    // @ts-expect-error
    expect(() => extractClauses(undefined)).toThrow();
    // @ts-expect-error
    expect(() => extractClauses(123)).toThrow();
  });

  it('throws an error if input is an empty string', () => {
    expect(() => extractClauses('')).toThrow('Invalid input: rawText must be a non-empty string.');
  });
}); 