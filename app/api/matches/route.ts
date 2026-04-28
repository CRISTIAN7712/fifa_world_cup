import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureTournament } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { matchSelect, progressKnockout, recomputeStandings } from '@/lib/tournament';

export async function GET(req: NextRequest) {
  const ensured = await ensureTournament(req);
  if ('error' in ensured) return ensured.error;
  const data = await prisma.match.findMany({ where: { tournamentId: ensured.tournamentId }, orderBy: [{ date: 'asc' }], select: matchSelect });
  return NextResponse.json({ matches: data });
}

const updateSchema = z.object({ id: z.string(), homeScore: z.number().int().min(0), awayScore: z.number().int().min(0) });

export async function PATCH(req: NextRequest) {
  const ensured = await ensureTournament(req);
  if ('error' in ensured) return ensured.error;
  const body = updateSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const result = await prisma.match.updateMany({
    where: { id: body.data.id, tournamentId: ensured.tournamentId },
    data: { homeScore: body.data.homeScore, awayScore: body.data.awayScore }
  });
  if (result.count === 0) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  await recomputeStandings(ensured.tournamentId);
  await progressKnockout(ensured.tournamentId);
  return NextResponse.json({ ok: true });
}
