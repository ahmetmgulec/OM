/**
 * SpacetimeAuth OIDC configuration.
 * Enable by setting VITE_SPACETIMEAUTH_CLIENT_ID in your .env
 */
import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';

export const SPACETIMEAUTH_CLIENT_ID = import.meta.env.VITE_SPACETIMEAUTH_CLIENT_ID ?? '';

export const isSpacetimeAuthConfigured = (): boolean =>
  !!SPACETIMEAUTH_CLIENT_ID && SPACETIMEAUTH_CLIENT_ID !== 'your-spacetimeauth-client-id';

/**
 * OIDC scopes. Default includes `offline_access` so the token endpoint can issue a **refresh token**.
 *
 * **Embedded browsers (Cursor / Electron):** `signinSilent` uses the refresh token first — no
 * cross-site iframe — so silent renew works even when third-party cookies block `prompt=none` in an
 * iframe. If SpacetimeAuth rejects this scope for your client, set `VITE_OIDC_SCOPE=openid profile email`.
 */
const OIDC_SCOPE =
  (import.meta.env.VITE_OIDC_SCOPE as string | undefined)?.trim() ||
  'openid profile email offline_access';

/**
 * Shared OIDC settings. `silent_redirect_uri` must match a URI registered on the SpacetimeAuth
 * client — using the same value as `redirect_uri` avoids a second registration (e.g. silent-renew.html).
 */
export function getOidcUserManagerSettings(): UserManagerSettings {
  const redirectUri = `${window.location.origin}/callback`;
  return {
    authority: 'https://auth.spacetimedb.com/oidc',
    client_id: SPACETIMEAUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    silent_redirect_uri: redirectUri,
    response_type: 'code',
    scope: OIDC_SCOPE,
    automaticSilentRenew: true,
    /**
     * How many seconds before access-token expiry oidc-client-ts fires `accessTokenExpiring` and runs silent renew.
     * ~120s works well for ~15m tokens; increase if you see renew too early.
     */
    accessTokenExpiringNotificationTimeInSeconds: 120,
    // Persist User + refresh_token so silent renew can use refresh path after reload (default is sessionStorage).
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    // Iframe fallback only when no refresh_token: send id_token_hint for a new id_token (SpacetimeDB uses id_token).
    includeIdTokenInSilentRenew: true,
  };
}

export const oidcConfig = {
  ...getOidcUserManagerSettings(),
  post_logout_redirect_uri: window.location.origin,
} as const;
