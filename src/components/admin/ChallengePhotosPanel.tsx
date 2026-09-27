import { useEffect, useState } from "react";
import { Loader2, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

interface Submission {
  id: string;
  challenge_id: string;
  challenge_title: string;
  challenge_week: number;
  class_group: string;
  student_number: string;
  submitted_at: string;
  photo_signed_url: string | null;
}

interface Student {
  email: string;
  first_name: string | null;
  submissions: Submission[];
  completed_count: number;
  total_challenges: number;
}

interface StudentsPayload {
  total_submissions: number;
  total_students: number;
  students: Student[];
}

export function ChallengePhotosPanel() {
  const [payload, setPayload] = useState<StudentsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/students", { credentials: "include" });
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
    })();
  }, []);

  const toggle = (email: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-6 flex gap-2 text-sm text-red-700">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{error ?? "Could not load student submissions."}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-brand-green text-sm">Challenge Submissions</h3>
        <p className="text-[11px] text-slate-500">
          {payload.total_submissions} submissions · {payload.total_students} students
        </p>
      </div>

      {payload.students.length === 0 && (
        <p className="text-xs text-slate-400 py-6 text-center">No submissions yet.</p>
      )}

      <ul className="space-y-2">
        {payload.students.map((s) => {
          const isOpen = expanded.has(s.email);
          return (
            <li key={s.email} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(s.email)}
                className="w-full flex items-center justify-between gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-brand-green">
                      {s.first_name || "(no name)"}{" "}
                      <span className="text-slate-400 font-normal">{s.email}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-brand-orange">
                  {s.completed_count} / {s.total_challenges}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-3 space-y-3 bg-slate-50/40">
                  {s.submissions.map((sub) => (
                    <div key={sub.id} className="flex items-start gap-3">
                      {sub.photo_signed_url ? (
                        <img
                          src={sub.photo_signed_url}
                          alt={`Week ${sub.challenge_week}`}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-brand-green">
                          Week {sub.challenge_week} — {sub.challenge_title}
                        </p>
                        <p className="text-[10.5px] text-slate-500">
                          Class: {sub.class_group} · Student no: {sub.student_number}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(sub.submitted_at).toLocaleString("en-GB", {
                            timeZone: "Europe/London",
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
