import React, { useState } from 'react';
import { useReducer } from 'spacetimedb/react';
import { typedReducers } from '../reducers';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../contexts/LanguageContext';
import './AuthScreen.css';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const signupEmail = useReducer(typedReducers.signupEmail);
  const signupGoogle = useReducer(typedReducers.signupGoogle);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);

    try {
      await signupEmail({
        email,
        password,
        ...(name.trim() && { name: name.trim() }),
      });
      // Success - connection will be established automatically
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);

    try {
      // Decode the JWT token to get Google user info
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

      await signupGoogle({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      });
      // Success - connection will be established automatically
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'your-google-client-id-here') {
      setError(t('auth.googleNotConfigured'));
    } else {
      // Check if popup was blocked
      setError(t('auth.googleSignupFailed'));
    }
  };

  return (
    <div className="auth-form">
      <h2>{t('auth.signup')}</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleEmailSignup}>
        <div className="form-group">
          <label htmlFor="signup-name">{t('auth.nameOptional')}</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.name')}
            disabled={loading}
            maxLength={32}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">{t('auth.email')}</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password">{t('auth.password')}</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">{t('auth.confirmPassword')}</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? t('auth.signingUp') : t('auth.signup')}
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
          {t('auth.switchToLogin')}{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="link-button"
            disabled={loading}
          >
            {t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
}
