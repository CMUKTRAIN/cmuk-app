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

/**
 * Reads localStorage as a fallback / cache.
 * Returns null if nothing valid is present.
 */
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

/**
 * One-time migration: if server has no progress AND local cache has completed
 * challenges, push local state to server.
 */
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

      if (res.status === 401) {
        // Not signed in — fall back to local cache silently
        return null;
      }
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

    // 1. Try migration once
    await attemptMigration();

    // 2. Fetch authoritative state from server
    const server = await fetchFromServer();

    if (server) {
      // Update local cache to match
      localStorage.setItem(LOCAL_KEYS.challenges, JSON.stringify(server.challenges));
      localStorage.setItem(LOCAL_KEYS.badges, JSON.stringify(server.badges));
      localStorage.setItem(LOCAL_KEYS.points, String(server.userPoints));
      localStorage.setItem(LOCAL_KEYS.streak, String(server.streakDays));
      setState(server);
    } else {
      // No server, keep whatever cache we have (may be null)
      setError("Could not load progress. Showing cached data.");
    }
    setLoading(false);
  }, [fetchFromServer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleChallenge = useCallback(
    async (challengeId: string, completed: boolean) => {
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

        if (!res.ok) throw new Error("Toggle failed");

        const fresh = (await res.json()) as ProgressPayload;
        setState(fresh);
        localStorage.setItem(LOCAL_KEYS.challenges, JSON.stringify(fresh.challenges));
        localStorage.setItem(LOCAL_KEYS.badges, JSON.stringify(fresh.badges));
        localStorage.setItem(LOCAL_KEYS.points, String(fresh.userPoints));
        localStorage.setItem(LOCAL_KEYS.streak, String(fresh.streakDays));
      } catch (err: any) {
        console.error("Toggle error:", err?.message);
        // Revert by fetching from server
        const server = await fetchFromServer();
        if (server) setState(server);
      }
    },
    [fetchFromServer]
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
