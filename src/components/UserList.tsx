import React from 'react';
import { Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import './UserList.css';

interface User {
  identity: Identity;
  name?: string;
  online: boolean;
  lastIpAddress?: string;
}

interface ChannelMember {
  channelId: bigint;
  userId: Identity;
}

interface UserListProps {
  users: readonly User[];
  currentUserId: Identity | null;
  selectedChannelId?: bigint | null;
  channelMembers?: readonly ChannelMember[];
  currentUserPermissions?: bigint;
  onKickUser?: (userId: Identity) => Promise<void>;
  currentUserGlobalPermissions?: bigint;
}

export function UserList({ 
  users, 
  currentUserId, 
  selectedChannelId,
  channelMembers = [],
  currentUserPermissions = 0n,
  onKickUser,
  currentUserGlobalPermissions = 0n,
}: UserListProps) {
  const { t } = useLanguage();
  const onlineUsers = users.filter(u => u.online);
  const offlineUsers = users.filter(u => !u.online);

  const getUserDisplayName = (user: User) => {
    return user.name || user.identity.toHexString().substring(0, 8);
  };

  // Check if user has KICK_USER permission
  const Permissions = {
    KICK_USER: 1n << 6n,
    ADMIN: 1n << 63n,
  } as const;

  const checkPermission = (userPermissions: bigint, permission: bigint): boolean => {
    if ((userPermissions & Permissions.ADMIN) !== 0n) {
      return true;
    }
    return (userPermissions & permission) !== 0n;
  };

  const canKick = checkPermission(currentUserPermissions, Permissions.KICK_USER);
  
  // Check if current user is admin (can see IP addresses)
  const isAdmin = checkPermission(currentUserGlobalPermissions, Permissions.ADMIN) || 
                  checkPermission(currentUserPermissions, Permissions.ADMIN);

  // Check if user is a member of the selected channel
  const isChannelMember = (userId: Identity): boolean => {
    if (!selectedChannelId) return false;
    return channelMembers.some(
      m => m.channelId === selectedChannelId && m.userId.isEqual(userId)
    );
  };

  const handleKick = async (userId: Identity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onKickUser || !selectedChannelId) return;
    
    if (confirm(t('common.kickConfirm'))) {
      try {
        await onKickUser(userId);
      } catch (error: any) {
        alert(error?.message || t('users.kickFailed'));
      }
    }
  };

  return (
    <div className="user-list">
      <div className="user-section">
        <h3 className="user-section-title">
          {t('common.online')} — {onlineUsers.length}
        </h3>
        {onlineUsers.map((user) => {
          const isMember = isChannelMember(user.identity);
          const isCurrentUser = currentUserId && user.identity.isEqual(currentUserId);
          const showKickButton = !!(canKick && selectedChannelId && isMember && !isCurrentUser);
          
          return (
            <div
              key={user.identity.toHexString()}
              className={`user-item ${isCurrentUser ? 'current-user' : ''}`}
            >
            <span className="user-status online"></span>
            <span className="user-name">
              {getUserDisplayName(user)}
              {isAdmin ? (
                <span 
                  style={{ 
                    fontSize: '10px', 
                    color: '#72767d', 
                    marginLeft: '8px',
                    fontFamily: 'monospace'
                  }}
                  title={
                    user.lastIpAddress
                      ? `${t('common.ipAddress')}: ${user.lastIpAddress}`
                      : `${t('common.ipAddress')}: ${t('common.ipNotSet')}`
                  }
                >
                  {user.lastIpAddress ? `(${user.lastIpAddress})` : `(${t('common.ipNotSet')})`}
                </span>
              ) : null}
            </span>
            {showKickButton ? (
                <button
                  className="kick-user-btn"
                  onClick={(e) => handleKick(user.identity, e)}
                  title="Kullanıcıyı At"
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: 'none',
                    color: '#ed4245',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(237, 66, 69, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  At
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      {offlineUsers.length > 0 ? (
        <div className="user-section">
          <h3 className="user-section-title">
            {t('common.offline')} — {offlineUsers.length}
          </h3>
          {offlineUsers.map((user) => {
            const isMember = isChannelMember(user.identity);
            const isCurrentUser = currentUserId && user.identity.isEqual(currentUserId);
            const showKickButton = !!(canKick && selectedChannelId && isMember && !isCurrentUser);
            
            return (
              <div
                key={user.identity.toHexString()}
                className={`user-item ${isCurrentUser ? 'current-user' : ''}`}
              >
            <span className="user-status offline"></span>
            <span className="user-name">
              {getUserDisplayName(user)}
              {isAdmin ? (
                <span 
                  style={{ 
                    fontSize: '10px', 
                    color: '#72767d', 
                    marginLeft: '8px',
                    fontFamily: 'monospace'
                  }}
                  title={
                    user.lastIpAddress
                      ? `${t('common.ipAddress')}: ${user.lastIpAddress}`
                      : `${t('common.ipAddress')}: ${t('common.ipNotSet')}`
                  }
                >
                  {user.lastIpAddress ? `(${user.lastIpAddress})` : `(${t('common.ipNotSet')})`}
                </span>
              ) : null}
            </span>
            {showKickButton ? (
                  <button
                    className="kick-user-btn"
                    onClick={(e) => handleKick(user.identity, e)}
                    title="Kullanıcıyı At"
                    style={{
                      marginLeft: 'auto',
                      background: 'transparent',
                      border: 'none',
                      color: '#ed4245',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(237, 66, 69, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    At
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
