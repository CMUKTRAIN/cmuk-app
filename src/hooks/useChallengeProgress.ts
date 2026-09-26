import { useState, useEffect, useCallback } from "react";
import { Challenge, Badge } from "../types";

interface ProgressPayload {
  challenges: Challenge[];
  badges: Badge[];
  userPoints: number;
  streakDays: number;
  completedCount: number;
  totalCount: number;
}

interface UseChallengeProgressResult {
  challenges: Challenge[];
  badges: Badge[];
  userPoints: number;
  streakDays: number;
  completedCount: number;
  loading: boolean;
  error: string | null;
  toggleChallenge: (challengeId: string, completed: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

const LOCAL_KEYS = {
  challenges: "cmuk_challenges",
  badges: "cmuk_badges",
  points: "cmuk_points",
  streak: "cmuk_streak",
};

function readLocalCache(): ProgressPayload | null {
  try {
    const rawCh = localStorage.getItem(LOCAL_KEYS.challenges);
    const rawBd = localStorage.getItem(LOCAL_KEYS.badges);
    const rawPt = localStorage.getItem(LOCAL_KEYS.points);
    const rawSt = localStorage.getItem(LOCAL_KEYS.streak);
    if (!rawCh || !rawBd) return null;
    const challenges = JSON.parse(rawCh) as Challenge[];
    const badges = JSON.parse(rawBd) as Badge[];
    const userPoints = rawPt ? Number(rawPt) : 0;
    const streakDays = rawSt ? Number(rawSt) : 0;
    const completedCount = challenges.filter((c) => c.completed).length;
    return {
      challenges,
      badges,
      userPoints,
      streakDays,
      completedCount,
      totalCount: challenges.length,
    };
  } catch {
    return null;
  }
}

async function attemptMigration(): Promise<boolean> {
  const local = readLocalCache();
  if (!local) return false;
  const completedIds = local.challenges.filter((c) => c.completed).map((c) => c.id);
  if (completedIds.length === 0) return false;
  try {
    const res = await fetch("/api/challenges/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        completed_challenge_ids: completedIds,
        streak_days: local.streakDays,
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.migrated);
  } catch {
    return false;
  }
}

function cacheLocally(payload: ProgressPayload) {
  localStorage.setItem(LOCAL_KEYS.challenges, JSON.stringify(payload.challenges));
  localStorage.setItem(LOCAL_KEYS.badges, JSON.stringify(payload.badges));
  localStorage.setItem(LOCAL_KEYS.points, String(payload.userPoints));
  localStorage.setItem(LOCAL_KEYS.streak, String(payload.streakDays));
  window.dispatchEvent(new Event("cmuk_stat_update"));
}

export function useChallengeProgress(): UseChallengeProgressResult {
  const [state, setState] = useState<ProgressPayload | null>(() => readLocalCache());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFromServer = useCallback(async (): Promise<ProgressPayload | null> => {
    try {
      const res = await fetch("/api/challenges", {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Server responded " + res.status);
      return (await res.json()) as ProgressPayload;
    } catch (err: any) {
      console.warn("Challenge fetch failed:", err?.message);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await attemptMigration();
    const server = await fetchFromServer();
    if (server) {
      cacheLocally(server);
      setState(server);
    } else {
      setError("Could not load progress. Showing cached data.");
    }
    setLoading(false);
  }, [fetchFromServer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleChallenge = useCallback(
    async (challengeId: string, completed: boolean) => {
      // Block client-side if challenge is locked
      const current = state?.challenges.find((c) => c.id === challengeId);
      if (current?.submitted && completed === false) {
        console.warn("Challenge is locked — cannot un-complete.");
        return;
      }

      // Optimistic update
      setState((prev) => {
        if (!prev) return prev;
        const challenges = prev.challenges.map((c) =>
          c.id === challengeId ? { ...c, completed, currentCount: completed ? 1 : 0 } : c
        );
        const userPoints = challenges
          .filter((c) => c.completed)
          .reduce((sum, c) => sum + c.points, 0);
        const completedCount = challenges.filter((c) => c.completed).length;
        const badges = prev.badges.map((b) => {
          const owner = challenges.find((c) => c.badgeId === b.id);
          return { ...b, unlocked: owner?.completed ?? false };
        });
        return { ...prev, challenges, badges, userPoints, completedCount };
      });

      try {
        const res = await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ challenge_id: challengeId, completed }),
        });

        if (res.status === 403) {
          const server = await fetchFromServer();
          if (server) {
            cacheLocally(server);
            setState(server);
          }
          return;
        }

        if (!res.ok) throw new Error("Toggle failed");

        const fresh = (await res.json()) as ProgressPayload;
        cacheLocally(fresh);
        setState(fresh);
      } catch (err: any) {
        console.error("Toggle error:", err?.message);
        const server = await fetchFromServer();
        if (server) {
          cacheLocally(server);
          setState(server);
        }
      }
    },
    [fetchFromServer, state]
  );

  return {
    challenges: state?.challenges ?? [],
    badges: state?.badges ?? [],
    userPoints: state?.userPoints ?? 0,
    streakDays: state?.streakDays ?? 0,
    completedCount: state?.completedCount ?? 0,
    loading,
    error,
    toggleChallenge,
    refresh,
  };
}
