interface ChallengeCount {
  id: string;
  title: string;
  week: number;
  count: number;
}

export function ChallengeBreakdown({ data }: { data: ChallengeCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <h3 className="font-extrabold text-brand-green text-sm">Challenge Popularity</h3>
      <div className="space-y-3">
        {data.map((c) => {
          const pct = (c.count / max) * 100;
          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 truncate">
                  <span className="text-slate-400 font-mono">W{c.week}</span> · {c.title}
                </span>
                <span className="font-mono font-bold text-slate-500 flex-shrink-0 ml-2">
                  {c.count}
                </span>
              </div>
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-orange transition-all duration-500"
                  style={{ width: `${pct}%`, minWidth: c.count > 0 ? "6px" : "0" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
