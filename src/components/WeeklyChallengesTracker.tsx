import { useState } from "react";
import { Challenge, Badge } from "../types";
import {
  Award,
  Calendar,
  CheckSquare,
  Square,
  Info,
  Loader2,
  Lock,
} from "lucide-react";
import { useChallengeProgress } from "../hooks/useChallengeProgress";
import { ChallengeSubmissionModal } from "./ChallengeSubmissionModal";

const FALLBACK_BADGE: Badge = {
  id: "unknown",
  name: "Badge",
  description: "",
  icon: "🏆",
  color: "",
  unlocked: false,
};

export function WeeklyChallengesTracker() {
  const {
    challenges,
    badges: badgeCabinet,
    userPoints,
    streakDays,
    completedCount,
    loading,
    error,
    toggleChallenge,
    refresh,
  } = useChallengeProgress();

  const [submissionTarget, setSubmissionTarget] = useState<Challenge | null>(null);

  const handleToggle = async (ch: Challenge) => {
    if (ch.submitted) return; // locked
    await toggleChallenge(ch.id, !ch.completed);
  };

  const handleProofSuccess = async (challengeId: string) => {
    await refresh();
    try {
      await fetch("/api/notify-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challenge_id: challengeId }),
      });
    } catch (err) {
      console.error("Badge notification failed (non-fatal):", err);
    }
    setSubmissionTarget(null);
  };

  return (
    <div className="space-y-8" id="challenges-section">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 bg-[#FFEDD5] text-brand-orange rounded-xl font-black text-lg leading-none">🏆</div>
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">My Total Points</span>
            <span className="text-xl font-black text-brand-green font-mono">{userPoints} pts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 bg-orange-100/60 text-brand-orange rounded-xl font-black text-lg leading-none">🔥</div>
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Current Eating Streak</span>
            <span className="text-xl font-black text-brand-green font-mono">{streakDays} Days</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 bg-emerald-50 text-[#047857] rounded-xl font-black text-lg leading-none">🎯</div>
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Challenges Unlocked</span>
            <span className="text-xl font-black text-brand-green font-mono">
              {completedCount} of {challenges.length || 4}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-1.5 px-0.5">
            <Calendar className="w-4 h-4 text-brand-orange" /> My 4-Week Habit Schedule
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 ml-1" />}
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed px-0.5">
            Why not challenge yourself! Complete the challenges below within the next 4 weeks and be the first in your group to email photographic proof with your name, class group and student number to info@culinarymedicineuk.org to win a prize.
          </p>

          {error && <p className="text-[11px] text-amber-600 px-0.5">{error}</p>}

          <div className="space-y-3.5">
            {challenges.map((ch) => {
              const locked = Boolean(ch.submitted);

              return (
                <div
                  key={ch.id}
                  onClick={() => handleToggle(ch)}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    locked
                      ? "cursor-default"
                      : "cursor-pointer"
                  } ${
                    ch.completed
                      ? "bg-emerald-50/35 border-emerald-200 hover:bg-emerald-50 text-slate-800"
                      : "bg-white hover:bg-slate-50 border-slate-150 text-slate-600 shadow-sm"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {ch.completed ? (
                      <CheckSquare className="w-5 h-5 text-brand-green fill-emerald-50" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        ch.completed ? "bg-emerald-100/60 text-emerald-850" : "bg-slate-100 text-slate-500"
                      }`}>
                        Week {ch.week}
                      </span>
                      <span className="text-[10.5px] font-bold text-brand-orange font-mono">
                        +{ch.points} pts
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-extrabold text-xs sm:text-sm text-brand-green leading-snug">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>

                    <div className="pt-1 flex items-center gap-3">
                      <div className="h-1.5 bg-slate-100 rounded-lg flex-1 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${ch.completed ? "bg-brand-orange" : "bg-slate-300"}`}
                          style={{ width: ch.completed ? "100%" : "0%" }}
                        />
                      </div>

                      {ch.photoSignedUrl && (
                        <img
                          src={ch.photoSignedUrl}
                          alt={`Week ${ch.week} proof`}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                          loading="lazy"
                        />
                      )}

                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {ch.completed ? "1 / 1" : "0 / 1"}
                      </span>

                      {locked ? (
                        <span
                          className="flex items-center gap-1 text-[10.5px] font-extrabold text-slate-400 whitespace-nowrap"
                          title="Locked — photo proof submitted"
                        >
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      ) : (
                        !ch.completed && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubmissionTarget(ch);
                            }}
                            className="text-[10.5px] font-extrabold text-brand-orange hover:text-orange-600 underline underline-offset-2 whitespace-nowrap"
                          >
                            Submit proof →
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-extrabold text-brand-green text-sm flex items-center gap-1.5 px-0.5">
            <Award className="w-4 h-4 text-brand-orange" /> My Badges Cabinet
          </h3>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm grid grid-cols-2 gap-4">
            {badgeCabinet.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 transition-all duration-300 ${
                  badge.unlocked
                    ? `${badge.color} shadow-sm ring-1 ring-white/10 scale-102`
                    : "bg-slate-50 border-slate-200 opacity-40 text-slate-450 grayscale"
                }`}
              >
                <div className={`text-3xl filter drop-shadow-md p-2 rounded-lg bg-white/20 ${badge.unlocked ? "animate-bounce" : ""}`}>
                  {badge.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[11px] leading-tight font-sans text-brand-green">
                    {badge.name}
                  </h4>
                  <p className="text-[9px] text-slate-500 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-orange-50/50 border border-orange-100/60 rounded-2xl flex gap-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <span className="font-bold text-slate-800 font-sans">Did you know?</span>
              <p className="leading-relaxed text-slate-500">
                Completing weekly challenges and updating your habit counts is a science-proven behavior change strategy. Doing it within a community or hospital program doubles retention rates!
              </p>
            </div>
          </div>
        </div>
      </div>

      {submissionTarget && (
        <ChallengeSubmissionModal
          challenge={submissionTarget}
          badge={badgeCabinet.find((b) => b.id === submissionTarget.badgeId) ?? FALLBACK_BADGE}
          onClose={() => setSubmissionTarget(null)}
          onSuccess={() => handleProofSuccess(submissionTarget.id)}
        />
      )}
    </div>
  );
}
