import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { logout as legacyLogout } from '../lib/auth';

type LogoutFn = () => void;

const LogoutContext = createContext<LogoutFn | null>(null);

export function useLogout(): LogoutFn {
  const fn = useContext(LogoutContext);
  if (!fn) {
    throw new Error('useLogout must be used within LogoutProvider');
  }
  return fn;
}

export function SpacetimeAuthLogoutProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const logout = () => auth.signoutRedirect();
  return (
    <LogoutContext.Provider value={logout}>
      {children}
    </LogoutContext.Provider>
  );
}

export function LegacyLogoutProvider({ children }: { children: ReactNode }) {
  return (
    <LogoutContext.Provider value={legacyLogout}>
      {children}
    </LogoutContext.Provider>
  );
}
