import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Identity } from 'spacetimedb';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DbConnection, ErrorContext } from './module_bindings/index.ts';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { AUTH_TOKEN_KEY } from './lib/auth';
import { SpacetimeAuthGate } from './components/SpacetimeAuthGate';
import { isSpacetimeAuthConfigured } from './config/auth';
import { LegacyLogoutProvider } from './contexts/LogoutContext';

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'mytestapp';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

// AUTH_TOKEN_KEY imported from ./lib/auth - used for connection token

const onConnect = (conn: DbConnection, identity: Identity, token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  console.log(
    'Connected to SpacetimeDB with identity:',
    identity.toHexString()
  );
  console.log('SpacetimeDB client version:', '2.0.3');
  console.log('Database:', DB_NAME);
  console.log('Host:', HOST);
  // Subscribe to all tables - required for useTable (channel, message, voiceRoom, voiceParticipant, voiceSignaling, etc.)
  conn.subscriptionBuilder().subscribeToAllTables();
};

const onDisconnect = () => {
  console.log('Disconnected from SpacetimeDB');
};

// Track if we've already shown the schema mismatch error to prevent reload loops
let schemaMismatchShown = false;

const onConnectError = (_ctx: ErrorContext, err: Error) => {
  console.error('Error connecting to SpacetimeDB:', err);
  console.error('Error stack:', err.stack);
  console.error('Error context:', _ctx);
  // If it's a deserialization error, show message but don't reload (prevents loops)
  const errorMessage = err.message || String(err);
  if (
    (errorMessage.includes('deserialize') || 
    errorMessage.includes('option type') || 
    errorMessage.includes("Can't deserialize") ||
    errorMessage.includes('tag') ||
    errorMessage.includes('Offset is outside the bounds') ||
    errorMessage.includes('DataView') ||
    errorMessage.includes('couldn\'t find')) &&
    !schemaMismatchShown
  ) {
    schemaMismatchShown = true;
    console.error('⚠️ SCHEMA MISMATCH DETECTED!');
    console.error('The database has old schema data that doesn\'t match the current code.');
    console.error('');
    console.error('🔧 SOLUTION:');
    console.error('1. Stop the dev server (Ctrl+C)');
    console.error('2. Run: npm run spacetime:publish');
    console.error('3. Restart the dev server: npm run dev');
    console.error('');
    console.error('This will clear the database and apply the new schema.');
    
    // Show user-friendly error message on page
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f04747;
      color: white;
      padding: 20px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="margin: 0 0 10px 0; font-size: 18px;">⚠️ Schema Mismatch Error</h2>
        <p style="margin: 0 0 15px 0; line-height: 1.5;">
          The database has old schema data. You need to republish the SpacetimeDB module.
        </p>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px;">
          <div style="margin-bottom: 10px;"><strong>Steps to fix:</strong></div>
          <div>1. Stop the dev server (Ctrl+C in terminal)</div>
          <div>2. Run: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 2px;">npm run spacetime:publish</code></div>
          <div>3. Restart: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 2px;">npm run dev</code></div>
        </div>
      </div>
    `;
    document.body.prepend(errorDiv);
  }
};

// Catch Google OAuth postMessage errors (popup blocked/closed)
window.addEventListener('error', (event) => {
  const errorMessage = event.message || String(event.error);
  if (
    errorMessage.includes('postMessage') ||
    errorMessage.includes('Cannot read properties of null')
  ) {
    // Suppress Google OAuth popup errors - they're harmless
    event.preventDefault();
    return false;
  }
});

// Also catch unhandled promise rejections (like the one in the error)
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  const errorMessage = error?.message || String(error);
  
  // Suppress Google OAuth postMessage errors
  if (
    errorMessage.includes('postMessage') ||
    errorMessage.includes('Cannot read properties of null')
  ) {
    event.preventDefault();
    return;
  }
  
  if (
    (errorMessage.includes('deserialize') || 
    errorMessage.includes('option type') || 
    errorMessage.includes("Can't deserialize") ||
    errorMessage.includes('tag') ||
    errorMessage.includes('couldn\'t find')) &&
    !schemaMismatchShown
  ) {
    schemaMismatchShown = true;
    console.error('⚠️ SCHEMA MISMATCH DETECTED (unhandled rejection)!');
    console.error('The database has old schema data that doesn\'t match the current code.');
    console.error('');
    console.error('🔧 SOLUTION:');
    console.error('1. Stop the dev server (Ctrl+C)');
    console.error('2. Run: npm run spacetime:publish');
    console.error('3. Restart the dev server: npm run dev');
    
    // Show user-friendly error message on page
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f04747;
      color: white;
      padding: 20px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="margin: 0 0 10px 0; font-size: 18px;">⚠️ Schema Mismatch Error</h2>
        <p style="margin: 0 0 15px 0; line-height: 1.5;">
          The database has old schema data. You need to republish the SpacetimeDB module.
        </p>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px;">
          <div style="margin-bottom: 10px;"><strong>Steps to fix:</strong></div>
          <div>1. Stop the dev server (Ctrl+C in terminal)</div>
          <div>2. Run: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 2px;">npm run spacetime:publish</code></div>
          <div>3. Restart: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 2px;">npm run dev</code></div>
        </div>
      </div>
    `;
    document.body.prepend(errorDiv);
    event.preventDefault(); // Prevent default error logging
  }
});

const connectionBuilder = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken(localStorage.getItem(AUTH_TOKEN_KEY) || undefined)
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError);

// Legacy auth (email + optional Google) when SpacetimeAuth is not configured
const LegacyAppWrapper = (
  <LegacyLogoutProvider>
    {GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here' ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
          <App />
        </SpacetimeDBProvider>
      </GoogleOAuthProvider>
    ) : (
      <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
        <App />
      </SpacetimeDBProvider>
    )}
  </LegacyLogoutProvider>
);

// Use SpacetimeAuth when VITE_SPACETIMEAUTH_CLIENT_ID is set; otherwise use legacy auth
const Root = isSpacetimeAuthConfigured() ? (
  <SpacetimeAuthGate />
) : (
  LegacyAppWrapper
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      {Root}
    </LanguageProvider>
  </StrictMode>
);
