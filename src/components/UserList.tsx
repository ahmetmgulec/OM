import React, { useState } from 'react';
import { Identity } from 'spacetimedb';
import { useLanguage } from '../contexts/LanguageContext';
import { Avatar } from './Avatar';
import { UserDetailsModal } from './UserDetailsModal';
import './UserList.css';

interface User {
  identity: Identity;
  name?: string;
  online: boolean;
  avatar?: string;
  lastSeenAt?: { microsSinceUnixEpoch: bigint };
  authMethod?: string;
}

interface ChannelMember {
  channelId: bigint;
  userId: Identity;
}

interface UserListProps {
  users: readonly User[];
  /** Admin-only view rows; empty map for non-admins */
  reportedIpByUserHex?: ReadonlyMap<string, string>;
  currentUserId: Identity | null;
  selectedChannelId?: bigint | null;
  channelMembers?: readonly ChannelMember[];
  currentUserPermissions?: bigint;
  onKickUser?: (userId: Identity) => Promise<void>;
  currentUserGlobalPermissions?: bigint;
}

export function UserList({ 
  users, 
  reportedIpByUserHex,
  currentUserId, 
  selectedChannelId,
  channelMembers = [],
  currentUserPermissions = 0n,
  onKickUser,
  currentUserGlobalPermissions = 0n,
}: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { t } = useLanguage();
  const onlineUsers = users.filter(u => u.online);
  const offlineUsers = users.filter(u => !u.online);

  const getUserDisplayName = (user: User) => {
    return user.name?.trim() || t('common.anonymous');
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
              onClick={() => setSelectedUser(user)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedUser(user)}
            >
            <span className="user-status online"></span>
            <Avatar avatarUrl={user.avatar} name={user.name} size={24} className="user-list-avatar" />
            <span className="user-name">
              {getUserDisplayName(user)}
            </span>
            {showKickButton ? (
                <button
                  className="kick-user-btn"
                  onClick={(e) => {
                    handleKick(user.identity, e);
                    e.stopPropagation();
                  }}
                  title={t('common.kickUser')}
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
                  {t('common.kick')}
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
                onClick={() => setSelectedUser(user)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedUser(user)}
              >
            <span className="user-status offline"></span>
            <Avatar avatarUrl={user.avatar} name={user.name} size={24} className="user-list-avatar" />
            <span className="user-name">
              {getUserDisplayName(user)}
            </span>
            {showKickButton ? (
                  <button
                    className="kick-user-btn"
                    onClick={(e) => {
                      handleKick(user.identity, e);
                      e.stopPropagation();
                    }}
                    title={t('common.kickUser')}
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
                    {t('common.kick')}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser ? {
          identity: selectedUser.identity,
          name: selectedUser.name,
          online: selectedUser.online,
          avatar: selectedUser.avatar,
          lastIpAddress: reportedIpByUserHex?.get(selectedUser.identity.toHexString()),
          lastSeenAt: selectedUser.lastSeenAt,
          authMethod: selectedUser.authMethod,
        } : null}
        isAdmin={isAdmin}
        onKick={onKickUser}
        canKick={!!(canKick && selectedChannelId && selectedUser && isChannelMember(selectedUser.identity) && currentUserId && !selectedUser.identity.isEqual(currentUserId))}
        isCurrentUser={!!(currentUserId && selectedUser?.identity.isEqual(currentUserId))}
      />
    </div>
  );
}
