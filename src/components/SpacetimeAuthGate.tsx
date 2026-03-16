import React, { useMemo } from 'react';
import { AuthProvider, useAuth } from 'react-oidc-context';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection, ErrorContext } from '../module_bindings/index.ts';
import { Identity } from 'spacetimedb';
import App from '../App.tsx';
import { oidcConfig, isSpacetimeAuthConfigured } from '../config/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { SpacetimeAuthLogoutProvider } from '../contexts/LogoutContext';

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
    return (
      <div className="app-container">
        <div className="loading-screen">
          <h1>{t('auth.error') ?? 'Error'}</h1>
          <p style={{ color: '#b9bbbe', marginTop: 12 }}>{auth.error.message}</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return (
      <div className="app-container">
        <div className="loading-screen">
          <h1>{t('auth.redirecting') ?? 'Redirecting to sign in...'}</h1>
        </div>
      </div>
    );
  }

  return (
    <SpacetimeAuthLogoutProvider>
      <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
        <App />
      </SpacetimeDBProvider>
    </SpacetimeAuthLogoutProvider>
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
