import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MessageInput.css';

interface MessageInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({ onSubmit, placeholder = 'Type a message...', disabled = false }: MessageInputProps) {
  const [text, setText] = useState('');
  const { t } = useLanguage();

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
          onChange={(e) => setText(e.target.value)}
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
