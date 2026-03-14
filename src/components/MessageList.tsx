import React from 'react';
import { Timestamp, Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import './MessageList.css';

export interface Message {
  id: bigint;
  sender: Identity;
  text: string;
  sent: Timestamp;
  editedAt?: Timestamp;
  channelId?: bigint;
  threadId?: bigint;
}

interface MessageListProps {
  messages: Message[];
  users: Map<string, { name?: string; identity: Identity }>;
  currentUserId: Identity | null;
  channelName?: string;
  channelDescription?: string;
  onEditMessage?: (messageId: bigint, newText: string) => void;
}

export function MessageList({
  messages,
  users,
  currentUserId,
  channelName,
  channelDescription,
  onEditMessage,
}: MessageListProps) {
  const { t } = useLanguage();

  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = 
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderName = (identity: Identity) => {
    const user = users.get(identity.toHexString());
    return user?.name || identity.toHexString().substring(0, 8);
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            {channelName && (
              <h3 className="empty-state-title">#{channelName}</h3>
            )}
            {channelDescription && (
              <p className="empty-state-description">{channelDescription}</p>
            )}
            <p className="empty-state-cta">{t('messages.empty')}</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const senderName = getSenderName(message.sender);
          const isOwnMessage = currentUserId && message.sender.isEqual(currentUserId);
          
          return (
            <div key={message.id.toString()} className={`message ${isOwnMessage ? 'own-message' : ''}`}>
              <div className="message-header">
                <span className="message-author">{senderName}</span>
                <span className="message-time">{formatTime(message.sent)}</span>
                {message.editedAt && (
                  <span className="message-edited">(edited)</span>
                )}
              </div>
              <div className="message-content">{message.text}</div>
            </div>
          );
        })
      )}
    </div>
  );
}
