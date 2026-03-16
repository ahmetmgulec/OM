const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'mytestapp';

export const AUTH_TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;

export function logout(): void {
  // Clear auth token for current host
  localStorage.removeItem(AUTH_TOKEN_KEY);
  // Clear for common alternate hosts in case user switched (local vs maincloud)
  const hosts = [
    'ws://localhost:3000',
    'wss://localhost:3000',
    'wss://mainnet.spacetimedb.com',
    'wss://maincloud.spacetimedb.com',
    'https://maincloud.spacetimedb.com',
  ];
  hosts.forEach((host) => localStorage.removeItem(`${host}/${DB_NAME}/auth_token`));
  // Clear any keys that look like SpacetimeDB auth tokens
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.endsWith('/auth_token')) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  window.location.reload();
}
