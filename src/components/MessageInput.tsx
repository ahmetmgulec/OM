import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthActivity } from '../contexts/AuthActivityContext';
import './MessageInput.css';

interface MessageInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TYPING_ACTIVITY_THROTTLE_MS = 45_000;

export function MessageInput({ onSubmit, placeholder = 'Type a message...', disabled = false }: MessageInputProps) {
  const [text, setText] = useState('');
  const { t } = useLanguage();
  const { markActivity } = useAuthActivity();
  const lastTypingActivityRef = useRef(0);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      const now = Date.now();
      if (now - lastTypingActivityRef.current < TYPING_ACTIVITY_THROTTLE_MS) return;
      lastTypingActivityRef.current = now;
      markActivity();
    },
    [markActivity]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSubmit(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('input.placeholder')}
          disabled={disabled}
          rows={1}
          style={{ resize: 'none', minHeight: '44px', maxHeight: '200px' }}
        />
        <button type="submit" disabled={!text.trim() || disabled}>
          {t('input.send')}
        </button>
      </form>
    </div>
  );
}
