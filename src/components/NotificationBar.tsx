import React from 'react';
import './NotificationBar.css';

type NotificationType = 'error' | 'success' | 'info';

interface NotificationBarProps {
  message: string;
  type?: NotificationType;
  onClose?: () => void;
}

export function NotificationBar({ message, type = 'error', onClose }: NotificationBarProps) {
  if (!message) return null;

  return (
    <div className={`notification-bar notification-bar--${type}`}>
      <span className="notification-bar__message">{message}</span>
      {onClose && (
        <button className="notification-bar__close" onClick={onClose} aria-label="Close notification">
          ×
        </button>
      )}
    </div>
  );
}

