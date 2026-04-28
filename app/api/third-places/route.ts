import { NextRequest, NextResponse } from 'next/server';
import { ensureTournament } from '@/lib/api';
import { getThirdPlaces, recomputeStandings } from '@/lib/tournament';

export async function GET(req: NextRequest) {
  const ensured = await ensureTournament(req);
  if ('error' in ensured) return ensured.error;
  await recomputeStandings(ensured.tournamentId);
  const ranking = await getThirdPlaces(ensured.tournamentId);
  return NextResponse.json({ ranking, qualified: ranking.slice(0, 8) });
}
