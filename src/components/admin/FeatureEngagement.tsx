interface EngagementRow {
  label: string;
  count: number;
}

const COLORS = [
  "#1A3C34", // brand green
  "#059669", // emerald
  "#E45B10", // brand orange
  "#F59E0B", // amber
  "#3B82F6", // blue
  "#8B5CF6", // purple
];

export function FeatureEngagement({ data }: { data: EngagementRow[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <p className="text-xs text-slate-400">No engagement data yet.</p>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-brand-green text-sm">Feature Engagement</h3>
        <p className="text-[11px] text-slate-500">Actions taken across all students</p>
      </div>

      <div className="space-y-3">
        {data.map((d, i) => {
          const pct = (d.count / max) * 100;
          return (
            <div key={d.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">{d.label}</span>
                <span className="font-mono font-bold text-slate-500">{d.count}</span>
              </div>
              <div className="h-5 bg-slate-50 rounded-md overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: COLORS[i % COLORS.length],
                    minWidth: d.count > 0 ? "8px" : "0",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
