import { useEffect, useState } from 'react';
import type { User } from 'oidc-client-ts';
import { useAuth } from 'react-oidc-context';

function formatAccessTokenRemaining(expiresAtSec: number): string {
  const now = Date.now() / 1000;
  const sec = Math.max(0, Math.floor(expiresAtSec - now));
  if (sec <= 0) return '0s';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m ${s}s`;
  }
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Logs OIDC events + shows access-token remaining time (fixed corner overlay).
 * Mounted when `import.meta.env.DEV` or `VITE_OIDC_DEBUG=true` (see SpacetimeAuthGate).
 */
export function OidcDebug() {
  const auth = useAuth();
  /** Forces re-render every second while the access-token countdown is shown. */
  const [, setTick] = useState(0);

  useEffect(() => {
    const ev = auth.events;

    const onUserLoaded = (u: User) => console.log('[OIDC] userLoaded', u.profile?.sub);
    const onUserUnloaded = () => console.log('[OIDC] userUnloaded');
    const onAccessTokenExpiring = () => console.log('[OIDC] accessTokenExpiring');
    const onAccessTokenExpired = () => console.log('[OIDC] accessTokenExpired');
    const onSilentRenewError = (e: unknown) => console.warn('[OIDC] silentRenewError', e);
    const onUserSignedOut = () => console.log('[OIDC] userSignedOut');

    ev.addUserLoaded(onUserLoaded);
    ev.addUserUnloaded(onUserUnloaded);
    ev.addAccessTokenExpiring(onAccessTokenExpiring);
    ev.addAccessTokenExpired(onAccessTokenExpired);
    ev.addSilentRenewError(onSilentRenewError);
    ev.addUserSignedOut(onUserSignedOut);

    return () => {
      ev.removeUserLoaded(onUserLoaded);
      ev.removeUserUnloaded(onUserUnloaded);
      ev.removeAccessTokenExpiring(onAccessTokenExpiring);
      ev.removeAccessTokenExpired(onAccessTokenExpired);
      ev.removeSilentRenewError(onSilentRenewError);
      ev.removeUserSignedOut(onUserSignedOut);
    };
  }, [auth.events]);

  useEffect(() => {
    console.log('[OIDC] state', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      error: auth.error?.message,
      activeNavigator: auth.activeNavigator,
      hasUser: !!auth.user,
    });
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth.activeNavigator, auth.user]);

  const expiresAt = auth.user?.expires_at;
  useEffect(() => {
    if (expiresAt === undefined) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  if (!auth.isAuthenticated || expiresAt === undefined) {
    return null;
  }

  const tokenRemaining = formatAccessTokenRemaining(expiresAt);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        right: 8,
        bottom: 8,
        zIndex: 99999,
        maxWidth: 280,
        padding: '8px 10px',
        borderRadius: 6,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 11,
        lineHeight: 1.35,
        color: '#dcddde',
        background: 'rgba(32, 34, 37, 0.92)',
        border: '1px solid #4f545c',
        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ opacity: 0.75, marginBottom: 2 }}>OIDC debug</div>
      <div>
        <strong style={{ color: '#fff' }}>Access token</strong>
        <span style={{ marginLeft: 6 }}>{tokenRemaining}</span>
      </div>
    </div>
  );
}
