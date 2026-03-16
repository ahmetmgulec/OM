const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'ws://localhost:3000';
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'mytestapp';

export const AUTH_TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.reload();
}
