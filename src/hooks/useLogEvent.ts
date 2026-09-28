import { useCallback } from "react";

interface LogEventOptions {
  metadata?: Record<string, unknown>;
}

export function useLogEvent() {
  return useCallback(
    async (eventType: string, options: LogEventOptions = {}) => {
      try {
        await fetch("/api/challenges?action=log-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            event_type: eventType,
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
