import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'wc_token';

export type AuthPayload = { userId: string; email: string };

function getSecret() {
  return process.env.JWT_SECRET ?? 'dev-secret';
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}

export async function getAuthFromRequest(req: NextRequest): Promise<AuthPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret()) as AuthPayload;
  } catch {
    return null;
  }
}
