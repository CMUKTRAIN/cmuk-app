import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Check, X, Eye, Clock } from "lucide-react";

interface PendingSubmission {
  id: string;
  student_email: string;
  first_name: string | null;
  class_group: string;
  student_number: string;
  challenge_id: string;
  challenge_title: string;
  challenge_week: number;
  submitted_at: string;
  photo_signed_url: string | null;
}

interface PendingPayload {
  total: number;
  submissions: PendingSubmission[];
}

export function PendingReviewPanel() {
  const [payload, setPayload] = useState<PendingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<PendingSubmission | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin?action=pending", { credentials: "include" });
      if (!res.ok) {
        setError(`Failed to load: ${res.status}`);
        setLoading(false);
        return;
      }
      setPayload(await res.json());
    } catch (err: any) {
      setError(err?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const review = async (submission: PendingSubmission, decision: "approve" | "reject") => {
    setBusyId(submission.id);
    try {
      const res = await fetch("/api/admin?action=review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ submission_id: submission.id, decision }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Review failed");
        return;
      }
      setLightbox(null);
      await load();
    } catch (err: any) {
      setError(err?.message ?? "Network error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6 flex gap-2 text-sm text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!payload) return null;

  if (payload.total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
        <p className="text-xs text-slate-400">No submissions awaiting review.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-amber-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-brand-green text-sm">Pending Review</h3>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md">
            {payload.total} awaiting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payload.submissions.map((s) => (
            <div key={s.id} className="border border-slate-100 rounded-xl p-4 flex gap-3">
              <button
                type="button"
                onClick={() => setLightbox(s)}
                className="flex-shrink-0 relative group"
              >
                {s.photo_signed_url ? (
                  <>
                    <img
                      src={s.photo_signed_url}
                      alt={`Week ${s.challenge_week}`}
                      className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-slate-100" />
                )}
              </button>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-brand-green truncate">
                    {s.first_name || "(no name)"}
                  </p>
                  <p className="text-[10.5px] text-slate-500 truncate">{s.student_email}</p>
                  <p className="text-[10.5px] text-slate-600 font-semibold">
                    W{s.challenge_week} · {s.challenge_title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {s.class_group} · {s.student_number}
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => review(s, "approve")}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[11px] font-bold transition"
                  >
                    {busyId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => review(s, "reject")}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[11px] font-bold transition"
                  >
                    <X className="w-3 h-3" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-brand-green text-sm">
                  {lightbox.first_name || "(no name)"} · {lightbox.student_email}
                </p>
                <p className="text-[11px] text-slate-500">
                  W{lightbox.challenge_week} · {lightbox.challenge_title} · {lightbox.class_group}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-900 flex items-center justify-center p-4">
              {lightbox.photo_signed_url && (
                <img
                  src={lightbox.photo_signed_url}
                  alt="Submission"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                disabled={busyId === lightbox.id}
                onClick={() => review(lightbox, "approve")}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition"
              >
                <Check className="w-4 h-4" /> Approve
              </button>
              <button
                type="button"
                disabled={busyId === lightbox.id}
                onClick={() => review(lightbox, "reject")}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-sm transition"
              >
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
