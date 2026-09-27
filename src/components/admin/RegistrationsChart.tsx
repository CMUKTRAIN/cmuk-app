interface DataPoint {
  date: string;
  count: number;
}

export function RegistrationsChart({ series }: { series: DataPoint[] }) {
  if (series.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <p className="text-xs text-slate-400">No registration data yet.</p>
      </div>
    );
  }

  const width = 640;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 32, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxCount = Math.max(1, ...series.map((d) => d.count));
  const stepX = chartW / Math.max(1, series.length - 1);

  const points = series.map((d, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + chartH - (d.count / maxCount) * chartH,
    ...d,
  }));

  // Smooth path via Catmull-Rom-ish curve
  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) / 2;
      const cpx2 = prev.x + (p.x - prev.x) / 2;
      return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-brand-green text-sm">Registrations Over Time</h3>
        <p className="text-[11px] text-slate-500">Last 14 days</p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E45B10" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#E45B10" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + chartH * (1 - t);
          const val = Math.round(maxCount * t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                {val}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#regGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#E45B10" strokeWidth="2.5" strokeLinecap="round" />

        {/* Points */}
        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r="3.5" fill="#E45B10" />
        ))}

        {/* X-axis labels (every 2nd) */}
        {points.map((p, i) =>
          i % 2 === 0 ? (
            <text
              key={`x-${p.date}`}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#94A3B8"
            >
              {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
