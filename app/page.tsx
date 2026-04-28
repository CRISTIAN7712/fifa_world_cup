'use client';

import { useEffect, useMemo, useState } from 'react';
import { MatchCard } from '@/components/MatchCard';

type Tab = 'grupos' | 'terceros' | 'eliminatoria';

export default function Page() {
  const [tab, setTab] = useState<Tab>('grupos');
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [third, setThird] = useState<any[]>([]);
  const [auth, setAuth] = useState({ email: 'demo@worldcup.local', password: 'password123' });

  const load = async () => {
    const m = await fetch('/api/matches').then((r) => r.json());
    const s = await fetch('/api/standings').then((r) => r.json());
    const t = await fetch('/api/third-places').then((r) => r.json());
    setMatches(m.matches ?? []);
    setStandings(s.standings ?? []);
    setThird(t.ranking ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const groupedStandings = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const s of standings) (map[s.group] ??= []).push(s);
    return map;
  }, [standings]);

  const playedMatches = matches.filter((m) => m.homeScore !== null && m.awayScore !== null).length;

  async function login(path: 'login' | 'register') {
    await fetch(`/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auth)
    });
    await load();
  }

  async function saveScore(id: string, homeScore: number, awayScore: number) {
    await fetch('/api/matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, homeScore, awayScore })
    });
    await load();
  }

  async function simulateAll() {
    await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true })
    });
    await load();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 space-y-6">
      <header className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">FIFA 2026 Manager</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">Panel de Gestión del Mundial</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Administra resultados, clasificaciones por grupo, ranking de terceros y eliminatorias en un solo lugar.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat title="Partidos" value={String(matches.length)} />
            <Stat title="Jugados" value={String(playedMatches)} />
          </div>
        </div>
      </header>

      <section className="glass rounded-2xl p-4 md:p-5">
        <h2 className="section-title mb-4">Autenticación</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input className="input md:max-w-sm" placeholder="email" value={auth.email} onChange={(e) => setAuth((a) => ({ ...a, email: e.target.value }))} />
          <input className="input md:max-w-sm" placeholder="password" type="password" value={auth.password} onChange={(e) => setAuth((a) => ({ ...a, password: e.target.value }))} />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => login('register')}>Registrarse</button>
            <button className="btn-secondary" onClick={() => login('login')}>Iniciar sesión</button>
            <button className="btn-secondary" onClick={simulateAll}>Simular todo</button>
          </div>
        </div>
      </section>

      <nav className="glass inline-flex rounded-2xl p-1">
        {(['grupos', 'terceros', 'eliminatoria'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === t ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      {tab === 'grupos' && (
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(groupedStandings).map(([group, rows]) => (
              <div key={group} className="glass rounded-2xl overflow-hidden">
                <div className="border-b border-white/10 bg-white/5 px-4 py-3">
                  <h3 className="font-semibold">Grupo {group}</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Equipo</th>
                      <th className="px-3 py-2 text-right">PTS</th>
                      <th className="px-3 py-2 text-right">DG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r: any) => (
                      <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-3 py-2">{r.position}</td>
                        <td className="px-3 py-2">{r.team.name}</td>
                        <td className="px-3 py-2 text-right font-semibold">{r.points}</td>
                        <td className="px-3 py-2 text-right">{r.goalDiff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div>
            <h2 className="section-title mb-3">Partidos de grupos</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {matches.filter((m) => m.phase === 'groups').map((m) => <MatchCard key={m.id} match={m} onSave={saveScore} />)}
            </div>
          </div>
        </section>
      )}

      {tab === 'terceros' && (
        <section className="glass rounded-2xl p-5">
          <h2 className="section-title mb-4">Ranking de terceros</h2>
          <div className="space-y-2">
            {third.map((t, i) => (
              <div key={t.teamId} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold">{i + 1}</span>
                  <span className="font-medium">{t.teamName}</span>
                  <span className="text-xs text-slate-400">Grupo {t.group}</span>
                </div>
                <span className="font-semibold text-emerald-300">{t.points} pts</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'eliminatoria' && (
        <section>
          <h2 className="section-title mb-3">Bracket eliminatorio</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {matches.filter((m) => m.phase === 'knockout').map((m) => <MatchCard key={m.id} match={m} onSave={saveScore} />)}
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
