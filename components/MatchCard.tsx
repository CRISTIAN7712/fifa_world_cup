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
    <div className="rounded-xl border border-slate-700 p-4 bg-slate-900">
      <div className="text-xs text-slate-400">{new Date(match.date).toLocaleDateString()} • {match.stadium} ({match.city})</div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Team name={match.homeTeam.name} code={match.homeTeam.code} />
        <input className="w-14 rounded p-1 text-center" type="number" min={0} value={home} onChange={(e) => setHome(Number(e.target.value))} />
        <span>-</span>
        <input className="w-14 rounded p-1 text-center" type="number" min={0} value={away} onChange={(e) => setAway(Number(e.target.value))} />
        <Team name={match.awayTeam.name} code={match.awayTeam.code} />
      </div>
      <button className="mt-3 rounded bg-emerald-600 px-3 py-1 text-sm" onClick={() => onSave(match.id, home, away)}>Guardar</button>
    </div>
  );
}

function Team({ name, code }: { name: string; code: string }) {
  return <div className="flex items-center gap-2 min-w-40"><img src={`https://flagcdn.com/w40/${code}.png`} alt={name} className="h-5 w-8 object-cover" /> <span>{name}</span></div>;
}
