import { MatchRound, Prisma } from '@prisma/client';
import { prisma } from './prisma';

const rankSorter = <T extends { points: number; goalDiff: number; goalsFor: number; teamName: string }>(a: T, b: T) =>
  b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor || a.teamName.localeCompare(b.teamName);

export async function recomputeStandings(tournamentId: string) {
  const teams = await prisma.team.findMany({ where: { tournamentId } });
  const matches = await prisma.match.findMany({ where: { tournamentId, phase: 'groups' } });
  const byId = new Map(teams.map((t) => [t.id, t]));
  const rows = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    group: team.groupLetter,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
    position: 0
  }));
  const rowMap = new Map(rows.map((r) => [r.teamId, r]));

  for (const m of matches) {
    if (m.homeScore == null || m.awayScore == null) continue;
    const home = rowMap.get(m.homeTeamId)!;
    const away = rowMap.get(m.awayTeamId)!;
    home.played++; away.played++;
    home.goalsFor += m.homeScore; home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore; away.goalsAgainst += m.homeScore;
    if (m.homeScore > m.awayScore) { home.wins++; home.points += 3; away.losses++; }
    else if (m.homeScore < m.awayScore) { away.wins++; away.points += 3; home.losses++; }
    else { home.draws++; away.draws++; home.points++; away.points++; }
  }

  for (const r of rows) r.goalDiff = r.goalsFor - r.goalsAgainst;

  const grouped = new Map<string, typeof rows>();
  for (const r of rows) {
    const arr = grouped.get(r.group) ?? [];
    arr.push(r);
    grouped.set(r.group, arr);
  }

  for (const arr of grouped.values()) {
    arr.sort(rankSorter);
    arr.forEach((r, idx) => (r.position = idx + 1));
  }

  await prisma.standing.deleteMany({ where: { tournamentId } });
  await prisma.standing.createMany({
    data: rows.map((r) => ({
      tournamentId,
      teamId: r.teamId,
      group: r.group,
      played: r.played,
      wins: r.wins,
      draws: r.draws,
      losses: r.losses,
      goalsFor: r.goalsFor,
      goalsAgainst: r.goalsAgainst,
      goalDiff: r.goalDiff,
      points: r.points,
      position: r.position
    }))
  });

  return rows.map((r) => ({ ...r, code: byId.get(r.teamId)?.code ?? '' }));
}

export async function getThirdPlaces(tournamentId: string) {
  const standings = await prisma.standing.findMany({ where: { tournamentId, position: 3 }, include: { team: true } });
  return standings
    .map((s) => ({ teamId: s.teamId, teamName: s.team.name, code: s.team.code, group: s.group, points: s.points, goalDiff: s.goalDiff, goalsFor: s.goalsFor }))
    .sort(rankSorter);
}

function dateFromIso(day: string) { return new Date(`${day}T17:00:00.000Z`); }

export async function generateKnockoutIfNeeded(tournamentId: string) {
  const existing = await prisma.match.count({ where: { tournamentId, phase: 'knockout' } });
  if (existing > 0) return;

  const standings = await prisma.standing.findMany({ where: { tournamentId }, include: { team: true } });
  const groups = [...new Set(standings.map((s) => s.group))].sort();
  const qualifiers: { teamId: string; teamName: string; group: string; rank: number; points: number; goalDiff: number; goalsFor: number }[] = [];

  for (const g of groups) {
    const gRows = standings.filter((s) => s.group === g).map((s) => ({ ...s, teamName: s.team.name })).sort((a, b) => rankSorter({ ...a, teamName: a.teamName }, { ...b, teamName: b.teamName }));
    qualifiers.push(...gRows.slice(0, 2).map((r, idx) => ({ teamId: r.teamId, teamName: r.team.name, group: r.group, rank: idx + 1, points: r.points, goalDiff: r.goalDiff, goalsFor: r.goalsFor })));
  }

  const third = standings.filter((s) => s.position === 3).map((s) => ({ teamId: s.teamId, teamName: s.team.name, group: s.group, rank: 3, points: s.points, goalDiff: s.goalDiff, goalsFor: s.goalsFor })).sort(rankSorter).slice(0, 8);
  qualifiers.push(...third);

  const seeded = [...qualifiers].sort(rankSorter);
  const pairs = Array.from({ length: 16 }, (_, i) => [seeded[i], seeded[seeded.length - 1 - i]]);
  const dates = ['2026-06-28','2026-06-28','2026-06-29','2026-06-29','2026-06-30','2026-06-30','2026-07-01','2026-07-01','2026-07-02','2026-07-02','2026-07-03','2026-07-03','2026-07-03','2026-07-03','2026-07-02','2026-07-01'];

  await prisma.match.createMany({
    data: pairs.map((p, idx) => ({ tournamentId, homeTeamId: p[0].teamId, awayTeamId: p[1].teamId, date: dateFromIso(dates[idx]), stadium: 'TBD', city: 'TBD', round: MatchRound.R32, phase: 'knockout' }))
  });

  const nextRounds: Array<{count: number; round: MatchRound; start: string; end?: string; finalStadium?: string}> = [
    { count: 8, round: MatchRound.R16, start: '2026-07-04' },
    { count: 4, round: MatchRound.QF, start: '2026-07-09' },
    { count: 2, round: MatchRound.SF, start: '2026-07-14' },
    { count: 1, round: MatchRound.THIRD_PLACE, start: '2026-07-18' },
    { count: 1, round: MatchRound.FINAL, start: '2026-07-19', finalStadium: 'MetLife Stadium' }
  ];

  for (const round of nextRounds) {
    await prisma.match.createMany({
      data: Array.from({ length: round.count }, (_, i) => ({
        tournamentId,
        homeTeamId: seeded[0].teamId,
        awayTeamId: seeded[1].teamId,
        homeScore: null,
        awayScore: null,
        date: dateFromIso(round.start),
        stadium: round.finalStadium ?? 'TBD',
        city: round.finalStadium ? 'New York/New Jersey' : 'TBD',
        group: null,
        round: round.round,
        phase: 'knockout'
      }))
    });
  }
}

export async function progressKnockout(tournamentId: string) {
  const rounds: MatchRound[] = [MatchRound.R32, MatchRound.R16, MatchRound.QF, MatchRound.SF];
  for (const round of rounds) {
    const matches = await prisma.match.findMany({ where: { tournamentId, round }, orderBy: { date: 'asc' } });
    if (!matches.length || matches.some((m) => m.homeScore == null || m.awayScore == null || m.homeScore === m.awayScore)) continue;
    const winners = matches.map((m) => (m.homeScore! > m.awayScore! ? m.homeTeamId : m.awayTeamId));
    const target = round === MatchRound.R32 ? MatchRound.R16 : round === MatchRound.R16 ? MatchRound.QF : round === MatchRound.QF ? MatchRound.SF : MatchRound.FINAL;
    const next = await prisma.match.findMany({ where: { tournamentId, round: target }, orderBy: { date: 'asc' } });
    for (let i = 0; i < Math.floor(winners.length / 2) && i < next.length; i++) {
      await prisma.match.update({ where: { id: next[i].id }, data: { homeTeamId: winners[i * 2], awayTeamId: winners[i * 2 + 1] } });
    }
    if (round === MatchRound.SF) {
      const losers = matches.map((m) => (m.homeScore! > m.awayScore! ? m.awayTeamId : m.homeTeamId));
      const third = await prisma.match.findFirst({ where: { tournamentId, round: MatchRound.THIRD_PLACE } });
      if (third) await prisma.match.update({ where: { id: third.id }, data: { homeTeamId: losers[0], awayTeamId: losers[1] } });
    }
  }
}

export async function simulateMatchForTournament(tournamentId: string, matchId: string) {
  const home = Math.floor(Math.random() * 5);
  const away = Math.floor(Math.random() * 5);
  await prisma.match.updateMany({ where: { id: matchId, tournamentId }, data: { homeScore: home, awayScore: away } });
}

export async function resetTournamentScores(tournamentId: string) {
  await prisma.match.updateMany({
    where: { tournamentId, phase: 'groups' },
    data: { homeScore: null, awayScore: null }
  });
  await prisma.match.deleteMany({ where: { tournamentId, phase: 'knockout' } });
  await recomputeStandings(tournamentId);
}

export const matchSelect = Prisma.validator<Prisma.MatchSelect>()({
  id: true,
  homeScore: true,
  awayScore: true,
  date: true,
  stadium: true,
  city: true,
  group: true,
  round: true,
  phase: true,
  homeTeam: { select: { id: true, name: true, code: true } },
  awayTeam: { select: { id: true, name: true, code: true } }
});
