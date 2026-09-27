import { useAdminAuth } from "../hooks/useAdminAuth";
import { EventStatsPanel } from "../components/admin/EventStatsPanel";
import { ChallengePhotosPanel } from "../components/admin/ChallengePhotosPanel";
import { Loader2, ShieldAlert, LogIn } from "lucide-react";

const APP_HOME = "https://app.culinarymedicineuk.training";

export function AdminPage() {
  const auth = useAdminAuth();

  if (auth.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!auth.signedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <LogIn className="w-10 h-10 text-brand-orange mx-auto" />
          <h2 className="font-extrabold text-brand-green text-lg">Sign in required</h2>
          <p className="text-sm text-slate-500">
            The admin portal is only accessible to signed-in staff.
          </p>
          <a
            href={APP_HOME}
            className="inline-block bg-brand-green hover:bg-[#1A3C34]/90 text-white font-black px-5 py-2.5 rounded-xl text-sm transition"
          >
            Go to sign in →
          </a>
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
          <p className="text-sm text-slate-500">
            You're signed in as <span className="font-mono">{auth.email}</span>, which isn't on the
            admin allowlist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-green">Admin Portal</h1>
        <p className="text-sm text-slate-500 mt-1">
          Signed in as <span className="font-mono">{auth.email}</span>
        </p>
      </div>

      <ChallengePhotosPanel />
      <EventStatsPanel />
    </div>
  );
}
