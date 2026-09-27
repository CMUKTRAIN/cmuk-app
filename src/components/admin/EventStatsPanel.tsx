import { useEffect, useState } from "react";
import { Loader2, Activity, AlertCircle } from "lucide-react";

interface EventStats {
  window_days: number;
  total_events: number;
  by_type: Array<{ event_type: string; count: number }>;
  top_users: Array<{ email: string; count: number }>;
  daily: Array<{ date: string; count: number }>;
}

export function EventStatsPanel() {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/events", { credentials: "include" });
        if (!res.ok) {
          setError(`Failed to load: ${res.status}`);
          setLoading(false);
          return;
        }
        setStats(await res.json());
      } catch (err: any) {
        setError(err?.message ?? "Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6 flex gap-2 text-sm text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error ?? "Could not load event stats."}</span>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-brand-orange" />
        <h3 className="font-extrabold text-brand-green text-sm">
          Event Activity — Last {stats.window_days} Days
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Events</p>
          <p className="text-2xl font-black text-brand-green font-mono mt-1">{stats.total_events}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Event Types</p>
          <p className="text-2xl font-black text-brand-green font-mono mt-1">{stats.by_type.length}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Users</p>
          <p className="text-2xl font-black text-brand-green font-mono mt-1">{stats.top_users.length}</p>
        </div>
      </div>

      {stats.daily.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Daily Volume</p>
          <div className="flex items-end gap-1 h-24">
            {stats.daily.map((d) => (
              <div
                key={d.date}
                className="flex-1 bg-brand-orange/70 hover:bg-brand-orange rounded-t transition-colors"
                style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: "2px" }}
                title={`${d.date}: ${d.count}`}
              />
            ))}
          </div>
        </div>
      )}

      {stats.by_type.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">By Type</p>
          <ul className="space-y-2">
            {stats.by_type.map((t) => (
              <li key={t.event_type} className="flex justify-between text-xs">
                <span className="font-mono text-slate-600">{t.event_type}</span>
                <span className="font-bold text-brand-green">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
