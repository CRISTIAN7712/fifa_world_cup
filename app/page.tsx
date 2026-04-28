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

  useEffect(() => { load(); }, []);

  const groupedStandings = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const s of standings) (map[s.group] ??= []).push(s);
    return map;
  }, [standings]);

  async function login(path: 'login' | 'register') {
    await fetch(`/api/auth/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(auth) });
    await load();
  }

  async function saveScore(id: string, homeScore: number, awayScore: number) {
    await fetch('/api/matches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, homeScore, awayScore }) });
    await load();
  }

  async function simulateAll() {
    await fetch('/api/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) });
    await load();
  }

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-5">
      <h1 className="text-3xl font-bold">Gestor Mundial Full-Stack</h1>

      <div className="rounded-xl bg-slate-900 p-4 border border-slate-700 space-y-2">
        <div className="font-semibold">Autenticación</div>
        <div className="flex gap-2 flex-wrap">
          <input className="rounded p-2" placeholder="email" value={auth.email} onChange={(e) => setAuth((a) => ({ ...a, email: e.target.value }))} />
          <input className="rounded p-2" placeholder="password" type="password" value={auth.password} onChange={(e) => setAuth((a) => ({ ...a, password: e.target.value }))} />
          <button className="bg-blue-600 rounded px-3" onClick={() => login('register')}>Register</button>
          <button className="bg-indigo-600 rounded px-3" onClick={() => login('login')}>Login</button>
          <button className="bg-emerald-700 rounded px-3" onClick={simulateAll}>Simular todo</button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['grupos', 'terceros', 'eliminatoria'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded ${tab === t ? 'bg-emerald-600' : 'bg-slate-800'}`}>{t}</button>
        ))}
      </div>

      {tab === 'grupos' && (
        <section className="grid gap-4 md:grid-cols-2">
          {Object.entries(groupedStandings).map(([group, rows]) => (
            <div key={group} className="border border-slate-700 rounded-xl p-3 bg-slate-900">
              <h2 className="font-bold mb-2">Grupo {group}</h2>
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((r: any) => <tr key={r.id}><td>{r.position}</td><td>{r.team.name}</td><td>{r.points}</td><td>{r.goalDiff}</td></tr>)}
                </tbody>
              </table>
            </div>
          ))}
          <div className="md:col-span-2">
            <h2 className="font-bold mb-2">Partidos de grupos</h2>
            <div className="grid md:grid-cols-2 gap-3">{matches.filter((m) => m.phase === 'groups').map((m) => <MatchCard key={m.id} match={m} onSave={saveScore} />)}</div>
          </div>
        </section>
      )}

      {tab === 'terceros' && (
        <section className="rounded-xl bg-slate-900 border border-slate-700 p-4">
          <h2 className="font-bold mb-2">Ranking de terceros</h2>
          <ol className="space-y-1">{third.map((t, i) => <li key={t.teamId}>{i + 1}. {t.teamName} ({t.group}) - {t.points} pts</li>)}</ol>
        </section>
      )}

      {tab === 'eliminatoria' && (
        <section>
          <h2 className="font-bold mb-2">Bracket</h2>
          <div className="grid md:grid-cols-2 gap-3">{matches.filter((m) => m.phase === 'knockout').map((m) => <MatchCard key={m.id} match={m} onSave={saveScore} />)}</div>
        </section>
      )}
    </main>
  );
}
