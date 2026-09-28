import { useEffect, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { PendingReviewPanel } from "../components/admin/PendingReviewPanel";
import { KpiCards } from "../components/admin/KpiCards";
import { RegistrationsChart } from "../components/admin/RegistrationsChart";
import { FeatureEngagement } from "../components/admin/FeatureEngagement";
import { Leaderboard } from "../components/admin/Leaderboard";
import { ChallengeBreakdown } from "../components/admin/ChallengeBreakdown";
import { ExportButtons } from "../components/admin/ExportButtons";
import { ChallengePhotosPanel } from "../components/admin/ChallengePhotosPanel";
import { EventStatsPanel } from "../components/admin/EventStatsPanel";
import { Loader2, ShieldAlert, LogIn } from "lucide-react";

const APP_HOME = "https://app.culinarymedicineuk.training";

interface DashboardData {
  kpis: {
    totalStudents: number;
    activeThisWeek: number;
    totalSubmissions: number;
    uniqueSubmitters: number;
    pendingReview: number;
  };
  registrationsSeries: Array<{ date: string; count: number }>;
  featureEngagement: Array<{ label: string; count: number }>;
  leaderboard: Array<{ email: string; first_name: string | null; plates: number; challenges: number; total: number }>;
  dailySeries: Array<{ date: string; count: number }>;
  challengeBreakdown: Array<{ id: string; title: string; week: number; count: number }>;
}

interface StudentsData {
  students: Array<{
    email: string;
    first_name: string | null;
    submissions: Array<{
      id: string;
      challenge_week: number;
      challenge_title: string;
      class_group: string;
      student_number: string;
      submitted_at: string;
      photo_signed_url: string | null;
    }>;
  }>;
}

export function AdminPage() {
  const auth = useAdminAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<StudentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const [dashRes, studRes] = await Promise.all([
          fetch("/api/admin?action=dashboard", { credentials: "include" }),
          fetch("/api/admin?action=students", { credentials: "include" }),
        ]);
        if (cancelled) return;
        if (!dashRes.ok || !studRes.ok) {
          setError(`Failed to load (${dashRes.status}/${studRes.status})`);
          setLoading(false);
          return;
        }
        setDashboard(await dashRes.json());
        setStudents(await studRes.json());
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [auth.isAdmin]);

  if (auth.loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  if (!auth.signedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <LogIn className="w-10 h-10 text-brand-orange mx-auto" />
          <h2 className="font-extrabold text-brand-green text-lg">Sign in required</h2>
          <a href={APP_HOME} className="inline-block bg-brand-green hover:bg-[#1A3C34]/90 text-white font-black px-5 py-2.5 rounded-xl text-sm transition">Go to sign in →</a>
        </div>
      </div>
    );
  }

  if (!auth.isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="font-extrabold text-brand-green text-lg">Not authorised</h2>
          <p className="text-sm text-slate-500">Signed in as <span className="font-mono">{auth.email}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-green">Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Signed in as <span className="font-mono">{auth.email}</span></p>
        </div>
        {students && students.students.length > 0 && <ExportButtons students={students.students} />}
      </div>

      <PendingReviewPanel />

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-700">{error}</div>
      )}

      {dashboard && !loading && (
        <>
          <KpiCards kpis={dashboard.kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RegistrationsChart series={dashboard.registrationsSeries} />
            <FeatureEngagement data={dashboard.featureEngagement} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Leaderboard entries={dashboard.leaderboard} />
            <ChallengeBreakdown data={dashboard.challengeBreakdown} />
          </div>
        </>
      )}

      <ChallengePhotosPanel />
      <EventStatsPanel />
    </div>
  );
}
