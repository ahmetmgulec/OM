import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { useLanguage } from '../contexts/LanguageContext';
import './AuthScreen.css';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t('auth.welcome')}</h1>
          <p>{t('auth.subtitle')}</p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
