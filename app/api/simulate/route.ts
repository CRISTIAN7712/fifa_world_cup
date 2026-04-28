import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureTournament } from '@/lib/api';
import { generateKnockoutIfNeeded, progressKnockout, recomputeStandings, resetTournamentScores, simulateMatchForTournament } from '@/lib/tournament';

const schema = z.object({ matchId: z.string().optional(), all: z.boolean().optional(), reset: z.boolean().optional() });

export async function POST(req: NextRequest) {
  const ensured = await ensureTournament(req);
  if ('error' in ensured) return ensured.error;
  const body = schema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  if (body.data.reset) {
    await resetTournamentScores(ensured.tournamentId);
    return NextResponse.json({ ok: true, reset: true });
  }

  if (body.data.all) {
    const { prisma } = await import('@/lib/prisma');
    const matches = await prisma.match.findMany({ where: { tournamentId: ensured.tournamentId } });
    for (const match of matches) await simulateMatchForTournament(ensured.tournamentId, match.id);
  } else if (body.data.matchId) {
    await simulateMatchForTournament(ensured.tournamentId, body.data.matchId);
  }

  await recomputeStandings(ensured.tournamentId);
  await generateKnockoutIfNeeded(ensured.tournamentId);
  await progressKnockout(ensured.tournamentId);
  return NextResponse.json({ ok: true });
}
