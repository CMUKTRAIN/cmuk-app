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
    // Check session in localStorage
    const storedUser = localStorage.getItem('cmuk_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('cmuk_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('cmuk_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cmuk_user');
    setUser(null);
  };

  return { user, loading, login, logout };
}
