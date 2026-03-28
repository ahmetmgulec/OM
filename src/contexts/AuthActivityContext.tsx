import React, { createContext, useCallback, useContext, useRef } from 'react';

interface AuthActivityContextValue {
  markActivity: () => void;
}

const AuthActivityContext = createContext<AuthActivityContextValue | null>(null);

/** Used for "user is here" session refresh; voice heartbeat + typing keep this fresh. */
const RECENT_ACTIVITY_MS = 15 * 60 * 1000;

export function AuthActivityProvider({
  children,
  lastActivityRef,
}: {
  children: React.ReactNode;
  lastActivityRef: React.MutableRefObject<number>;
}) {
  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, [lastActivityRef]);

  // Mark activity on mount (user loaded the app and is using it)
  React.useEffect(() => {
    markActivity();
  }, [markActivity]);

  const value = React.useMemo(() => ({ markActivity }), [markActivity]);

  return (
    <AuthActivityContext.Provider value={value}>
      {children}
    </AuthActivityContext.Provider>
  );
}

export function useAuthActivity(): AuthActivityContextValue {
  const ctx = useContext(AuthActivityContext);
  return ctx ?? { markActivity: () => {} };
}

export function hasRecentActivity(lastActivityRef: React.MutableRefObject<number>): boolean {
  const ts = lastActivityRef.current;
  return ts > 0 && Date.now() - ts < RECENT_ACTIVITY_MS;
}
