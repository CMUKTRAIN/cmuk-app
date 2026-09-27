interface LeaderboardEntry {
  email: string;
  first_name: string | null;
  plates: number;
  challenges: number;
  total: number;
}

const RANK_BADGES = ["🥇", "🥈", "🥉"];

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-extrabold text-brand-green text-sm mb-3">Most Active Students</h3>
        <p className="text-xs text-slate-400">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-brand-green text-sm">Most Active Students</h3>
        <p className="text-[11px] text-slate-500">By plates built + challenges completed</p>
      </div>

      <ul className="space-y-2">
        {entries.map((e, i) => (
          <li
            key={e.email}
            className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
          >
            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 flex-shrink-0 text-xs font-black text-slate-600">
              {RANK_BADGES[i] ?? i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-brand-green truncate">
                {e.first_name || e.email.split("@")[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{e.email}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10.5px] font-bold text-slate-500 whitespace-nowrap">
                {e.plates} {e.plates === 1 ? "plate" : "plates"}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[10.5px] font-bold text-brand-orange whitespace-nowrap">
                {e.challenges} {e.challenges === 1 ? "challenge" : "challenges"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
