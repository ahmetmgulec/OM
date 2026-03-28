import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorResponse } from 'oidc-client-ts';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection, ErrorContext } from '../module_bindings/index.ts';
import { Identity } from 'spacetimedb';
import App from '../App';
import { SessionExpiredScreen } from './SessionExpiredScreen';
import { oidcConfig, isSpacetimeAuthConfigured } from '../config/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { SpacetimeAuthLogoutProvider } from '../contexts/LogoutContext';
import { AuthActivityProvider } from '../contexts/AuthActivityContext';
import { OidcDebug } from './OidcDebug';

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'mytestapp';

let schemaMismatchShown = false;

/** Must stay in sync with module tables + the admin IP view (cannot use subscribeToAllTables + extra subscribe). */
const MODULE_SUBSCRIPTION_SQL = [
  'SELECT * FROM user',
  'SELECT * FROM channel',
  'SELECT * FROM channelMember',
  'SELECT * FROM message',
  'SELECT * FROM role',
  'SELECT * FROM roleMember',
  'SELECT * FROM thread',
  'SELECT * FROM voiceParticipant',
  'SELECT * FROM voiceRoom',
  'SELECT * FROM voiceSignaling',
  'SELECT * FROM user_reported_ip_for_admin',
] as const;

const REPORT_CLIENT_IP =
  import.meta.env.VITE_REPORT_CLIENT_IP === 'true';

const onConnect = (conn: DbConnection, identity: Identity) => {
  console.log('Connected to SpacetimeDB with identity:', identity.toHexString());
  conn.subscriptionBuilder().subscribe([...MODULE_SUBSCRIPTION_SQL]);

  // Optional: client-reported IP for admin UI (spoofable; third-party request when enabled).
  if (REPORT_CLIENT_IP) {
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data: { ip?: string }) => {
        if (data?.ip && typeof data.ip === 'string') {
          conn.reducers.reportClientIp({ ip: data.ip }).catch(() => {});
        }
      })
      .catch(() => {});
  }
};

const onConnectError = (_ctx: ErrorContext, err: Error) => {
  console.error('Error connecting to SpacetimeDB:', err);
  const msg = err.message || String(err);
  if (
    (msg.includes('deserialize') || msg.includes('option type') || msg.includes("Can't deserialize") ||
      msg.includes('tag') || msg.includes('Offset is outside the bounds') || msg.includes('DataView') ||
      msg.includes("couldn't find")) &&
    !schemaMismatchShown
  ) {
    schemaMismatchShown = true;
    console.error('⚠️ SCHEMA MISMATCH DETECTED! Run: npm run spacetime:publish');
  }
};

function onSigninCallback() {
  window.history.replaceState({}, document.title, window.location.pathname || '/');
}

/** Silent iframe / refresh cannot proceed — user must use full login (cookies blocked or SSO session gone). */
function needsInteractiveOidcLogin(error: unknown): boolean {
  if (error instanceof ErrorResponse && error.error) {
    return ['login_required', 'consent_required', 'interaction_required', 'account_selection_required'].includes(
      error.error
    );
  }
  const msg = error instanceof Error ? error.message : String(error);
  return /login_required|interaction_required|consent_required|account_selection_required/i.test(msg);
}

/** Only send user to full IdP login when access token is actually gone or imminently expiring. */
function shouldForceInteractiveLogin(expiresAtSeconds: number | undefined, bufferSeconds = 90): boolean {
  if (expiresAtSeconds === undefined) return false;
  return expiresAtSeconds <= Date.now() / 1000 + bufferSeconds;
}

function AppWithConnection() {
  const auth = useAuth();
  const { t } = useLanguage();
  const lastActivityRef = useRef(0);
  const authUserRef = useRef(auth.user);
  authUserRef.current = auth.user;
  const recoveryAttemptedRef = useRef(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Reset recovery flag when error clears (e.g. after successful sign-in)
  useEffect(() => {
    if (!auth.error) {
      recoveryAttemptedRef.current = false;
      setIsRecovering(false);
    }
  }, [auth.error]);

  // Doc-style `useAutoSignin` only supports redirect/popup. Restore session with silent first, then redirect.
  useEffect(() => {
    if (!auth.isLoading && !auth.error && !auth.isAuthenticated) {
      void auth.signinSilent().catch(() => {
        auth.signinRedirect();
      });
    }
  }, [auth.isLoading, auth.error, auth.isAuthenticated, auth.signinSilent, auth.signinRedirect]);

  // Silent renew often fails in iframe (cookies) while the stored session is still valid — don't send users to login.
  useEffect(() => {
    const remove = auth.events.addSilentRenewError((error) => {
      if (!needsInteractiveOidcLogin(error)) return;
      if (!shouldForceInteractiveLogin(authUserRef.current?.expires_at)) return;
      void auth.signinRedirect();
    });
    return () => {
      remove();
    };
  }, [auth.events, auth.signinRedirect]);

  // One silent renew attempt on any auth error before showing session expired (covers tab idle + pre-mount errors)
  useEffect(() => {
    if (!auth.error || recoveryAttemptedRef.current) return;
    recoveryAttemptedRef.current = true;
    setIsRecovering(true);
    void auth.signinSilent().then(
      () => setIsRecovering(false),
      () => setIsRecovering(false)
    );
  }, [auth.error, auth.signinSilent]);

  const connectionBuilder = useMemo(() => {
    const token = auth.user?.id_token ?? undefined;
    return DbConnection.builder()
      .withUri(HOST)
      .withDatabaseName(DB_NAME)
      .withToken(token)
      .onConnect(onConnect)
      .onDisconnect(() => console.log('Disconnected from SpacetimeDB'))
      .onConnectError(onConnectError);
  }, [auth.user?.id_token, auth.user?.expires_at]);

  if (auth.isLoading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <h1>{t('auth.loading') ?? 'Loading...'}</h1>
        </div>
      </div>
    );
  }

  if (auth.error) {
    if (isRecovering) {
      return (
        <div className="app-container">
          <div className="loading-screen">
            <h1>{t('auth.refreshingSession') ?? 'Refreshing session...'}</h1>
          </div>
        </div>
      );
    }
    return (
      <SessionExpiredScreen
        errorMessage={auth.error.message}
        onSignInAgain={() => auth.signinRedirect()}
      />
    );
  }

  if (!auth.isAuthenticated) {
    const isSilentSignIn = auth.activeNavigator === 'signinSilent';
    return (
      <div className="app-container">
        <div className="loading-screen">
          <h1>{isSilentSignIn ? (t('auth.loading') ?? 'Loading...') : (t('auth.redirecting') ?? 'Redirecting to sign in...')}</h1>
        </div>
      </div>
    );
  }

  // Silent-renew iframe uses the same /callback URI; do not mount DB or main UI (avoids duplicate WS).
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return null;
  }

  return (
    <AuthActivityProvider lastActivityRef={lastActivityRef}>
      <SpacetimeAuthLogoutProvider>
        <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/callback" element={<App />} />
            </Routes>
          </BrowserRouter>
        </SpacetimeDBProvider>
      </SpacetimeAuthLogoutProvider>
    </AuthActivityProvider>
  );
}

export function SpacetimeAuthGate() {
  if (!isSpacetimeAuthConfigured()) {
    return null;
  }

  return (
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      {(import.meta.env.DEV || import.meta.env.VITE_OIDC_DEBUG === 'true') && <OidcDebug />}
      <AppWithConnection />
    </AuthProvider>
  );
}
