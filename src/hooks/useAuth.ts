import { useState, useEffect } from 'react';

interface User {
  id: string;
  first_name: string;
  email: string;
  has_allergens: boolean;
  allergens: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    try {
      await fetch('/api/signout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    }
    setUser(null);
  };

  return { user, loading, login, logout };
}
