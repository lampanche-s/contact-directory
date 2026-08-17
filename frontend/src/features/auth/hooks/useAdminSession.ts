import { useCallback, useEffect, useState } from 'react';
import { apiAuthService } from '../services/authService';

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const session = await apiAuthService.getSession();

        if (!active) return;

        setIsAdmin(session.authenticated);
      } catch {
        if (!active) return;

        setIsAdmin(false);
      } finally {
        if (active) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const session = await apiAuthService.login(password.trim());

      if (!session.authenticated) {
        setLoginError('Incorrect password. Please check it and try again.');
        setIsAdmin(false);
        return false;
      }

      setLoginError('');
      setIsAdmin(true);
      return true;
    } catch {
      setLoginError('Incorrect password. Please check it and try again.');
      setIsAdmin(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiAuthService.logout();
    } finally {
      setIsAdmin(false);
      setLoginError('');
    }
  }, []);

  return {
    isAdmin,
    loginError,
    isCheckingSession,
    login,
    logout,
    clearLoginError: () => setLoginError('')
  };
}
