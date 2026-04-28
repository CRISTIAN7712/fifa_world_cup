import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getAuthFromRequest } from './auth';
import { groupMatchesRaw, groupTeams } from './tournamentData';
import { MatchRound } from '@prisma/client';

export async function ensureTournament(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  let tournament = await prisma.tournament.findUnique({ where: { userId: auth.userId } });
  if (!tournament) {
    tournament = await prisma.tournament.create({ data: { userId: auth.userId, name: 'Mi Mundial' } });
    const teams = Object.entries(groupTeams).flatMap(([group, entries]) => entries.map((t) => ({ ...t, group })));
    await prisma.team.createMany({ data: teams.map((t) => ({ tournamentId: tournament.id, name: t.name, code: t.code, groupLetter: t.group })) });
    const dbTeams = await prisma.team.findMany({ where: { tournamentId: tournament.id } });
    const teamIdByName = new Map(dbTeams.map((t) => [t.name, t.id]));
    const matches = groupMatchesRaw.trim().split('\n').map((line) => {
      const [date, home, away, stadium, city, group, round] = line.split('|');
      return {
        tournamentId: tournament.id,
        homeTeamId: teamIdByName.get(home)!,
        awayTeamId: teamIdByName.get(away)!,
        date: new Date(`${date}T17:00:00.000Z`),
        stadium,
        city,
        group,
        round: (`R${round}` as MatchRound),
        phase: 'groups' as const
      };
    });
    await prisma.match.createMany({ data: matches });
  }

  return { tournamentId: tournament.id, userId: auth.userId };
}
