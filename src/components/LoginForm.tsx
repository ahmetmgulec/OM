import React, { useState } from 'react';
import { useReducer } from 'spacetimedb/react';
import { typedReducers } from '../reducers';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../contexts/LanguageContext';
import './AuthScreen.css';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const loginEmail = useReducer(typedReducers.loginEmail);
  const loginGoogle = useReducer(typedReducers.loginGoogle);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginEmail({ email, password });
      // Success - connection will be established automatically
    } catch (err: any) {
      setError(err?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);

    try {
      // Decode the JWT token to get Google ID
      // In production, verify the token server-side
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      await loginGoogle({ googleId: payload.sub });
      // Success - connection will be established automatically
    } catch (err: any) {
      setError(err?.message || 'Failed to login with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'your-google-client-id-here') {
      setError(t('auth.googleNotConfigured'));
    } else {
      // Check if popup was blocked
      setError(t('auth.googleLoginFailed'));
    }
  };

  return (
    <div className="auth-form">
      <h2>{t('auth.login')}</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && 
       import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'your-google-client-id-here' && (
        <>
          <div className="auth-divider">
            <span>{t('auth.or')}</span>
          </div>
        <div className="google-auth-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
          />
        </div>
        </>
      )}

      <div className="auth-switch">
        <p>
          {t('auth.switchToSignup')}{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="link-button"
            disabled={loading}
          >
            {t('auth.signup')}
          </button>
        </p>
      </div>
    </div>
  );
}
