import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { SpacetimeAuthGate } from './components/SpacetimeAuthGate';
import { isSpacetimeAuthConfigured } from './config/auth';

// Track if we've already shown the schema mismatch error to prevent reload loops
let schemaMismatchShown = false;

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

// SpacetimeAuth is required - show config message when not configured
function SpacetimeAuthRequired() {
  return (
    <div className="app-container">
      <div className="loading-screen" style={{ padding: 24, textAlign: 'center' }}>
        <h1>SpacetimeAuth Required</h1>
        <p style={{ marginTop: 12, color: '#b9bbbe' }}>
          Set VITE_SPACETIMEAUTH_CLIENT_ID in your .env and enable SpacetimeAuth for your module in the dashboard.
        </p>
      </div>
    </div>
  );
}

const Root = isSpacetimeAuthConfigured() ? (
  <SpacetimeAuthGate />
) : (
  <SpacetimeAuthRequired />
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      {Root}
    </LanguageProvider>
  </StrictMode>
);
