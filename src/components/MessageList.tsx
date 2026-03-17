import React, { useRef, useEffect, useState } from 'react';
import { Timestamp, Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import { Avatar } from './Avatar';
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

const GROUP_TIME_MS = 5 * 60 * 1000; // 5 minutes

// Match URLs for linkification (http/https only)
const URL_REGEX = /(https?:\/\/[^\s<]+)/g;

function linkifyText(text: string): React.ReactNode[] {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="message-link"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function formatDateHeader(date: Date, now: Date): string {
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    yesterday.getFullYear() === date.getFullYear() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate();

  if (sameDay) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

interface MessageListProps {
  messages: Message[];
  users: Map<string, { name?: string; identity: Identity; avatar?: string }>;
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
}: MessageListProps) {
  const { t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevMessageCountRef = useRef(0);

  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSender = (identity: Identity) => {
    const user = users.get(identity.toHexString());
    return user;
  };

  const shouldShowHeader = (msg: Message, prev: Message | null, now: Date): boolean => {
    if (!prev) return true;
    const msgDate = msg.sent.toDate();
    const prevDate = prev.sent.toDate();
    const sameSender = msg.sender.toHexString() === prev.sender.toHexString();
    const withinGroupTime = msgDate.getTime() - prevDate.getTime() < GROUP_TIME_MS;
    const sameDay = msgDate.getDate() === prevDate.getDate() && msgDate.getMonth() === prevDate.getMonth() && msgDate.getFullYear() === prevDate.getFullYear();
    if (sameSender && withinGroupTime && sameDay) return false;
    return true;
  };

  const needsDateSeparator = (msg: Message, prev: Message | null, now: Date): boolean => {
    if (!prev) return true;
    const msgDate = msg.sent.toDate();
    const prevDate = prev.sent.toDate();
    return msgDate.getDate() !== prevDate.getDate() || msgDate.getMonth() !== prevDate.getMonth() || msgDate.getFullYear() !== prevDate.getFullYear();
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const threshold = 100;
    const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;
    setIsNearBottom(nearBottom);
    setShowScrollDown(!nearBottom && scrollHeight > clientHeight);
  };

  const scrollToBottom = () => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    setShowScrollDown(false);
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (messages.length > prevMessageCountRef.current && isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isNearBottom]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    handleScroll();
    const ro = new ResizeObserver(handleScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [channelName]);

  const now = new Date();

  return (
    <div className="message-list-wrapper">
      <div ref={listRef} className="message-list" onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">💬</div>
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
          messages.map((message, idx) => {
            const prev = idx > 0 ? messages[idx - 1] : null;
            const showHeader = shouldShowHeader(message, prev, now);
            const showDateSep = needsDateSeparator(message, prev, now);
            const sender = getSender(message.sender);
            const senderName = sender?.name?.trim() || t('common.anonymous');
            const isOwnMessage = currentUserId && message.sender.isEqual(currentUserId);

            return (
              <React.Fragment key={message.id.toString()}>
                {showDateSep && (
                  <div className="message-date-separator">
                    <span>{formatDateHeader(message.sent.toDate(), now)}</span>
                  </div>
                )}
                <div className={`message ${isOwnMessage ? 'own-message' : ''} ${!showHeader ? 'message-grouped' : ''}`}>
                  {showHeader ? (
                    <div className="message-row">
                      <Avatar avatarUrl={sender?.avatar} name={sender?.name} size={40} className="message-avatar" />
                      <div className="message-body">
                        <div className="message-header">
                          <span className="message-author">{senderName}</span>
                          <span className="message-time">{formatTime(message.sent)}</span>
                          {message.editedAt && (
                            <span className="message-edited">(edited)</span>
                          )}
                        </div>
                        <div className="message-content">
                          {linkifyText(message.text)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="message-row message-row-grouped">
                      <div className="message-avatar-spacer" />
                      <div className="message-body">
                        <div className="message-content">
                          {linkifyText(message.text)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
      {showScrollDown && messages.length > 0 && (
        <button
          type="button"
          className="scroll-to-bottom-btn"
          onClick={scrollToBottom}
          aria-label={t('common.scrollToBottom')}
        >
          ↓
        </button>
      )}
    </div>
  );
}
