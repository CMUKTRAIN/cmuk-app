import { useEffect, useState } from "react";

const DEFAULT_ADMIN_EMAILS = [
  "ux8@me.com",
  "sumi@culinarymedicineuk.org",
  "vince@culinarymedicineuk.org",
];

interface AdminAuthState {
  loading: boolean;
  signedIn: boolean;
  isAdmin: boolean;
  email: string | null;
  firstName: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    signedIn: false,
    isAdmin: false,
    email: null,
    firstName: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (cancelled) return;

        if (!res.ok) {
          setState({
            loading: false,
            signedIn: false,
            isAdmin: false,
            email: null,
            firstName: null,
          });
          return;
        }

        const data = await res.json();
        const email = typeof data.email === "string" ? data.email : null;
        const admins = DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
        const isAdmin = email ? admins.includes(email.toLowerCase()) : false;

        setState({
          loading: false,
          signedIn: true,
          isAdmin,
          email,
          firstName: data.first_name ?? null,
        });
      } catch {
        if (cancelled) return;
        setState({
          loading: false,
          signedIn: false,
          isAdmin: false,
          email: null,
          firstName: null,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
