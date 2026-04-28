import { NextRequest, NextResponse } from 'next/server';
import { ensureTournament } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { recomputeStandings } from '@/lib/tournament';

export async function GET(req: NextRequest) {
  try {
    const ensured = await ensureTournament(req);
    if ('error' in ensured) return ensured.error;
    await recomputeStandings(ensured.tournamentId);
    const standings = await prisma.standing.findMany({ where: { tournamentId: ensured.tournamentId }, include: { team: true }, orderBy: [{ group: 'asc' }, { position: 'asc' }] });
    return NextResponse.json({ standings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to compute standings' }, { status: 500 });
  }
}
