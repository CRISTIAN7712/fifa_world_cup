'use client';

import { useState } from 'react';

type Props = {
  match: any;
  onSave: (id: string, home: number, away: number) => Promise<void>;
};

export function MatchCard({ match, onSave }: Props) {
  const [home, setHome] = useState(match.homeScore ?? 0);
  const [away, setAway] = useState(match.awayScore ?? 0);

  return (
    <article className="glass rounded-2xl p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.07]">
      <header className="mb-3 flex items-start justify-between gap-3 text-xs text-slate-400">
        <div>
          <p>{new Date(match.date).toLocaleDateString()}</p>
          <p className="mt-1">{match.stadium} · {match.city}</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-300">
          {match.phase} {match.group ? `· G${match.group}` : ''}
        </div>
      </header>

      <div className="space-y-2">
        <Row name={match.homeTeam.name} code={match.homeTeam.code} value={home} onChange={setHome} />
        <Row name={match.awayTeam.name} code={match.awayTeam.code} value={away} onChange={setAway} />
      </div>

      <button className="btn-primary mt-4 w-full" onClick={() => onSave(match.id, home, away)}>
        Guardar marcador
      </button>
    </article>
  );
}

function Row({ name, code, value, onChange }: { name: string; code: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-2 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <img src={`https://flagcdn.com/w40/${code}.png`} alt={name} className="h-5 w-8 rounded-sm object-cover" />
        <span className="truncate text-sm">{name}</span>
      </div>
      <input
        className="h-9 w-14 rounded-lg border border-white/10 bg-slate-800 text-center text-sm text-white outline-none focus:border-emerald-400"
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
