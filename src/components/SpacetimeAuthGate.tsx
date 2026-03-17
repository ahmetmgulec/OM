import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection, ErrorContext } from '../module_bindings/index.ts';
import { Identity } from 'spacetimedb';
import App from '../App.tsx';
import { SessionExpiredScreen } from './SessionExpiredScreen';
import { oidcConfig, isSpacetimeAuthConfigured } from '../config/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { SpacetimeAuthLogoutProvider } from '../contexts/LogoutContext';
import { AuthActivityProvider, hasRecentActivity } from '../contexts/AuthActivityContext';

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'mytestapp';

let schemaMismatchShown = false;

const onConnect = (conn: DbConnection, identity: Identity) => {
  console.log('Connected to SpacetimeDB with identity:', identity.toHexString());
  conn.subscriptionBuilder().subscribeToAllTables();
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
  window.history.replaceState({}, document.title, '/');
}

function AppWithConnection() {
  const auth = useAuth();
  const { t } = useLanguage();
  const lastActivityRef = useRef(0);
  const recoveryAttemptedRef = useRef(false);
  const [isRecovering, setIsRecovering] = useState(false);

  // Reset recovery flag when error clears (e.g. after successful sign-in)
  useEffect(() => {
    if (!auth.error) {
      recoveryAttemptedRef.current = false;
      setIsRecovering(false);
    }
  }, [auth.error]);

  useEffect(() => {
    if (!auth.isLoading && !auth.error && !auth.isAuthenticated) {
      // Try silent sign-in first; skip consent prompt if user already said yes
      void auth.signinSilent().catch(() => {
        auth.signinRedirect();
      });
    }
  }, [auth.isLoading, auth.error, auth.isAuthenticated, auth.signinSilent, auth.signinRedirect]);

  // When auth.error with recent activity, try silent recovery once before showing session expired
  useEffect(() => {
    if (!auth.error || recoveryAttemptedRef.current) return;
    if (!hasRecentActivity(lastActivityRef)) return;
    recoveryAttemptedRef.current = true;
    setIsRecovering(true);
    void auth.signinSilent().then(
      () => setIsRecovering(false),
      () => setIsRecovering(false)
    );
  }, [auth.error, auth.signinSilent]);

  const connectionBuilder = useMemo(() => {
    // SpacetimeDB expects OIDC ID token for authentication
    const token = auth.user?.id_token ?? auth.user?.access_token ?? undefined;
    return DbConnection.builder()
      .withUri(HOST)
      .withDatabaseName(DB_NAME)
      .withToken(token)
      .onConnect(onConnect)
      .onDisconnect(() => console.log('Disconnected from SpacetimeDB'))
      .onConnectError(onConnectError);
  }, [auth.user?.id_token, auth.user?.access_token]);

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

  return (
    <AuthActivityProvider lastActivityRef={lastActivityRef}>
      <SpacetimeAuthLogoutProvider>
        <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
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
      <AppWithConnection />
    </AuthProvider>
  );
}
