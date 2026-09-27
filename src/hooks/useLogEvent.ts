import { useCallback } from "react";

interface LogEventOptions {
  metadata?: Record<string, unknown>;
}

export function useLogEvent() {
  return useCallback(
    async (eventType: string, userEmail: string | null, options: LogEventOptions = {}) => {
      try {
        await fetch("/api/log-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            event_type: eventType,
            user_email: userEmail,
            metadata: options.metadata ?? null,
          }),
        });
      } catch (err: any) {
        console.warn("log-event failed (non-fatal):", err?.message);
      }
    },
    []
  );
}
