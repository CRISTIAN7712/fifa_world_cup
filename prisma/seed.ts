import bcrypt from 'bcryptjs';
import { MatchRound } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { groupMatchesRaw, groupTeams } from '../lib/tournamentData';

async function main() {
  const email = 'demo@worldcup.local';
  await prisma.match.deleteMany();
  await prisma.standing.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({ data: { email, passwordHash: await bcrypt.hash('password123', 10) } });
  const tournament = await prisma.tournament.create({ data: { name: 'Mundial 2026', userId: user.id } });

  const allTeams = Object.entries(groupTeams).flatMap(([group, teams]) => teams.map((t) => ({ ...t, group })));
  await prisma.team.createMany({
    data: allTeams.map((t) => ({ tournamentId: tournament.id, name: t.name, code: t.code, groupLetter: t.group }))
  });

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
      phase: 'groups' as const,
      homeScore: null,
      awayScore: null
    };
  });

  await prisma.match.createMany({ data: matches });
  console.log('Seed completed:', { teams: allTeams.length, matches: matches.length, user: email, password: 'password123' });
}

main().finally(() => prisma.$disconnect());
