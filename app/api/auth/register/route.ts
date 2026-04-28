import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setAuthCookie, signToken } from '@/lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: body.data.email } });
  if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

  const user = await prisma.user.create({ data: { email: body.data.email, passwordHash: await bcrypt.hash(body.data.password, 10) } });
  const token = signToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}
