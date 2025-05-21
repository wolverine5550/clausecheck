import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../server', () => {
  const mockAuth = { getUser: vi.fn() };
  return {
    createClient: () => ({ auth: mockAuth }),
    __esModule: true,
    _mockAuth: mockAuth,
  };
});

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { requireUserOrRedirect } from '../require-user-or-redirect';
import { redirect } from 'next/navigation';
import * as serverModule from '../server';

describe('requireUserOrRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects if user is not authenticated', async () => {
    (serverModule as any)._mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    await requireUserOrRedirect();
    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('returns user if authenticated', async () => {
    const fakeUser = { id: '123', email: 'test@example.com' };
    (serverModule as any)._mockAuth.getUser.mockResolvedValue({ data: { user: fakeUser } });
    const result = await requireUserOrRedirect();
    expect(result).toEqual(fakeUser);
  });
}); 