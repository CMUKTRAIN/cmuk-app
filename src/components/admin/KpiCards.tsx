import { Users, Activity, Award, Image as ImageIcon } from "lucide-react";

interface Kpis {
  totalStudents: number;
  activeThisWeek: number;
  totalSubmissions: number;
  uniqueSubmitters: number;
}

export function KpiCards({ kpis }: { kpis: Kpis }) {
  const cards = [
    {
      label: "Total Students",
      value: kpis.totalStudents,
      icon: Users,
      accent: "bg-emerald-50 text-emerald-700",
      emoji: "🎓",
    },
    {
      label: "Active This Week",
      value: kpis.activeThisWeek,
      icon: Activity,
      accent: "bg-blue-50 text-blue-700",
      emoji: "⚡",
    },
    {
      label: "Challenge Submissions",
      value: kpis.totalSubmissions,
      icon: Award,
      accent: "bg-orange-50 text-orange-700",
      emoji: "🏆",
    },
    {
      label: "Unique Submitters",
      value: kpis.uniqueSubmitters,
      icon: ImageIcon,
      accent: "bg-purple-50 text-purple-700",
      emoji: "📸",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-start gap-4 animate-fade-in"
          >
            <div className={`p-2.5 rounded-xl ${c.accent}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none">
                {c.label}
              </p>
              <p className="text-2xl font-black text-brand-green font-mono mt-2 leading-none">
                {c.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
