import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeClauseWithOpenAI } from '../openai-clause-analysis';
import type { OpenAIClauseAnalysisResult } from '../openai-clause-analysis.types';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('analyzeClauseWithOpenAI', () => {
  const validResponse: OpenAIClauseAnalysisResult = {
    risk_score: 7,
    explanation: 'This clause exposes the party to significant liability.',
    suggestion: 'Limit liability or add indemnification.',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.OPENAI_API_KEY = 'test-key';
  });

  it('returns analysis result for a valid clause', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: JSON.stringify(validResponse) } }
        ]
      })
    });
    const result = await analyzeClauseWithOpenAI('Sample clause');
    expect(result).toEqual(validResponse);
  });

  it('throws if API key is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(analyzeClauseWithOpenAI('Sample clause')).rejects.toThrow('OpenAI API key is not set');
  });

  it('throws if OpenAI API returns error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Error' });
    await expect(analyzeClauseWithOpenAI('Sample clause')).rejects.toThrow('OpenAI API error');
  });

  it('throws if OpenAI returns no content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [ { message: { content: null } } ] })
    });
    await expect(analyzeClauseWithOpenAI('Sample clause')).rejects.toThrow('No content returned');
  });

  it('throws if OpenAI returns invalid JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [ { message: { content: 'not json' } } ] })
    });
    await expect(analyzeClauseWithOpenAI('Sample clause')).rejects.toThrow('Failed to parse');
  });

  it('throws if OpenAI response is missing required fields', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [ { message: { content: JSON.stringify({ risk_score: 'high' }) } } ] })
    });
    await expect(analyzeClauseWithOpenAI('Sample clause')).rejects.toThrow('missing required fields');
  });
}); 