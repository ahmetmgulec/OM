/**
 * SpacetimeAuth OIDC configuration.
 * Enable by setting VITE_SPACETIMEAUTH_CLIENT_ID in your .env
 */
export const SPACETIMEAUTH_CLIENT_ID = import.meta.env.VITE_SPACETIMEAUTH_CLIENT_ID ?? '';

export const isSpacetimeAuthConfigured = (): boolean =>
  !!SPACETIMEAUTH_CLIENT_ID && SPACETIMEAUTH_CLIENT_ID !== 'your-spacetimeauth-client-id';

export const oidcConfig = {
  authority: 'https://auth.spacetimedb.com/oidc',
  client_id: SPACETIMEAUTH_CLIENT_ID,
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: window.location.origin,
  // Required for silent token renewal - add to SpacetimeAuth client redirect URIs
  silent_redirect_uri: `${window.location.origin}/callback`,
  scope: 'openid profile email',
  response_type: 'code',
  automaticSilentRenew: true,
} as const;
