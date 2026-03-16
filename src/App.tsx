import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { tables } from './module_bindings';
import { typedReducers } from './reducers';
import { useSpacetimeDB, useTable, useReducer } from 'spacetimedb/react';
import { Identity } from 'spacetimedb';
import { Sidebar } from './components/Sidebar';
import { MessageList, Message } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { UserList } from './components/UserList';
import { CreateChannelModal } from './components/CreateChannelModal';
import { AddUserToChannelModal } from './components/AddUserToChannelModal';
import { RoleManagementModal } from './components/RoleManagementModal';
import { SettingsModal } from './components/SettingsModal';
import { logout } from './lib/auth';
import { VoiceControls } from './components/VoiceControls';
import { VoiceRecordings } from './components/VoiceRecordings';
import { AuthScreen } from './components/AuthScreen';
import { LanguageSelector } from './components/LanguageSelector';
import { NotificationBar } from './components/NotificationBar';
import { useVoiceChat } from './hooks/useVoiceChat';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const [selectedChannelId, setSelectedChannelId] = useState<bigint | null>(null);
  const [pendingVoiceJoin, setPendingVoiceJoin] = useState<bigint | null>(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [connectionTimedOut, setConnectionTimedOut] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null);

  const { identity, isActive: connected } = useSpacetimeDB();

  useEffect(() => {
    if (connected) {
      setConnectionTimedOut(false);
      return;
    }
    const t = setTimeout(() => setConnectionTimedOut(true), 15000);
    return () => clearTimeout(t);
  }, [connected]);
  const { t } = useLanguage();
  
  // Voice chat hook - must be called after identity is defined
  const voiceChat = useVoiceChat({
    channelId: selectedChannelId,
    currentUserId: identity || null,
    enabled: connected && !!identity && !!selectedChannelId,
    onError: (msg) => setNotification({ message: msg, type: 'error' }),
  });
  const setName = useReducer(typedReducers.setName);
  const sendMessage = useReducer(typedReducers.sendMessage);
  const createChannel = useReducer(typedReducers.createChannel);
  const joinChannel = useReducer(typedReducers.joinChannel);
  const addUserToChannel = useReducer(typedReducers.addUserToChannel);
  const kickUser = useReducer(typedReducers.kickUser);
  const createRole = useReducer(typedReducers.createRole);
  const assignRole = useReducer(typedReducers.assignRole);
  const removeRole = useReducer(typedReducers.removeRole);
  const deleteRole = useReducer(typedReducers.deleteRole);

  // Subscribe to tables with error handling
  const [channels] = useTable(tables.channel);
  const [channelMembers] = useTable(tables.channelMember);
  const [messages] = useTable(tables.message);
  const [users] = useTable(tables.user);
  const [replacedIdentities] = useTable(tables.replacedIdentity);
  const [roles] = useTable(tables.role);
  const [roleMembers] = useTable(tables.roleMember);
  const [voiceRooms] = useTable(tables.voiceRoom);
  const [voiceParticipants] = useTable(tables.voiceParticipant);

  // Hide replaced (old session) identities to avoid duplicate user entries after login
  const displayedUsers = useMemo(
    () => users.filter(u => !replacedIdentities.some(r => r.oldIdentity.isEqual(u.identity))),
    [users, replacedIdentities]
  );
  
  // Log table data to help debug
  useEffect(() => {
    console.log('Channels:', channels.length);
    console.log('ChannelMembers:', channelMembers.length);
    console.log('Messages:', messages.length);
    console.log('Users:', users.length);
  }, [channels, channelMembers, messages, users]);

  // Get channels the current user is a member of
  const userChannels = useMemo(() => {
    if (!identity) return [];
    const memberChannelIds = new Set(
      channelMembers
        .filter(m => m.userId.isEqual(identity))
        .map(m => m.channelId)
    );
    return channels.filter(c => memberChannelIds.has(c.id));
  }, [channels, channelMembers, identity]);

  // Get messages for the selected channel
  const channelMessages = useMemo(() => {
    if (!selectedChannelId) return [];
    return messages
      .filter(m => m.channelId === selectedChannelId && !m.threadId)
      .sort((a, b) => (a.sent.toDate() > b.sent.toDate() ? 1 : -1));
  }, [messages, selectedChannelId]);

  // Voice channel participants: channelId -> participants with names
  const voiceChannelParticipants = useMemo(() => {
    const map = new Map<bigint, { identity: Identity; name?: string }[]>();
    voiceRooms.forEach(room => {
      const participants = voiceParticipants
        .filter(p => p.roomId === room.id)
        .map(p => {
          const u = users.find(usr => usr.identity.isEqual(p.userId));
          return { identity: p.userId, name: u?.name };
        });
      map.set(room.channelId, participants);
    });
    return map;
  }, [voiceRooms, voiceParticipants, users]);

  // Create users map for quick lookup
  const usersMap = useMemo(() => {
    const map = new Map<string, { name?: string; identity: Identity }>();
    users.forEach(user => {
      map.set(user.identity.toHexString(), {
        name: user.name,
        identity: user.identity,
      });
    });
    return map;
  }, [users]);

  // Permission flags (must match backend)
  const Permissions = {
    CREATE_CHANNEL: 1n << 0n,
    DELETE_CHANNEL: 1n << 1n,
    MANAGE_CHANNEL: 1n << 2n,
    SEND_MESSAGE: 1n << 3n,
    EDIT_MESSAGE: 1n << 4n,
    DELETE_MESSAGE: 1n << 5n,
    KICK_USER: 1n << 6n,
    BAN_USER: 1n << 7n,
    ADD_USER: 1n << 8n,
    REMOVE_USER: 1n << 9n,
    MANAGE_ROLES: 1n << 10n,
    ASSIGN_ROLES: 1n << 11n,
    JOIN_VOICE: 1n << 12n,
    SPEAK_IN_VOICE: 1n << 13n,
    MUTE_OTHERS: 1n << 14n,
    ADMIN: 1n << 63n,
  } as const;

  // Helper function to check if user has permission
  const checkPermission = (userPermissions: bigint, permission: bigint): boolean => {
    // Admin has all permissions
    if ((userPermissions & Permissions.ADMIN) !== 0n) {
      return true;
    }
    return (userPermissions & permission) !== 0n;
  };

  // Get user's effective permissions for a channel (frontend version)
  const getUserChannelPermissions = useMemo(() => {
    return (userId: Identity, channelId: bigint): bigint => {
      let permissions = 0n;
      
      if (!userId || !channelId) return permissions;
      
      // Get all roles for this user
      const userRoles = roleMembers.filter(rm => rm.userId.isEqual(userId));
      
      // Get channel-specific roles and global roles
      const channelRoles = roles.filter(
        r => !r.channelId || r.channelId === channelId
      );
      
      // Calculate effective permissions (highest position role wins for conflicts)
      const relevantRoles = userRoles
        .map(rm => channelRoles.find(r => r.id === rm.roleId))
        .filter(r => r !== undefined)
        .sort((a, b) => {
          if (!a || !b) return 0;
          return a.position > b.position ? -1 : a.position < b.position ? 1 : 0;
        });
      
      // Combine permissions (OR operation)
      relevantRoles.forEach(role => {
        if (role) {
          permissions |= role.permissions;
        }
      });
      
      // Channel members always have basic permissions
      const isMember = channelMembers.some(
        m => m.channelId === channelId && m.userId.isEqual(userId)
      );
      
      if (isMember) {
        // Basic member permissions
        permissions |= Permissions.SEND_MESSAGE;
        permissions |= Permissions.JOIN_VOICE;
        permissions |= Permissions.SPEAK_IN_VOICE;
      }
      
      return permissions;
    };
  }, [roles, roleMembers, channelMembers]);

  // Get current user's permissions for selected channel
  const currentUserPermissions = useMemo(() => {
    if (!identity || !selectedChannelId) return 0n;
    return getUserChannelPermissions(identity, selectedChannelId);
  }, [identity, selectedChannelId, getUserChannelPermissions]);

  // Get current user's global permissions (for global roles)
  const currentUserGlobalPermissions = useMemo(() => {
    if (!identity) return 0n;
    let permissions = 0n;
    
    // Get all roles for this user
    const userRoles = roleMembers.filter(rm => rm.userId.isEqual(identity));
    
    // Get only global roles
    const globalRoles = roles.filter(r => !r.channelId);
    
    // Calculate effective permissions (highest position role wins for conflicts)
    const relevantRoles = userRoles
      .map(rm => globalRoles.find(r => r.id === rm.roleId))
      .filter(r => r !== undefined)
      .sort((a, b) => {
        if (!a || !b) return 0;
        return a.position > b.position ? -1 : a.position < b.position ? 1 : 0;
      });
    
    // Combine permissions (OR operation)
    relevantRoles.forEach(role => {
      if (role) {
        permissions |= role.permissions;
      }
    });
    
    return permissions;
  }, [identity, roles, roleMembers]);

  // Check if user can manage roles globally (has MANAGE_ROLES in global roles or ADMIN)
  const canManageRolesGlobally = useMemo(() => {
    return checkPermission(currentUserGlobalPermissions, Permissions.MANAGE_ROLES);
  }, [currentUserGlobalPermissions]);

  // Auto-select first channel when channels become available
  useEffect(() => {
    if (userChannels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(userChannels[0].id);
    }
  }, [userChannels, selectedChannelId]);

  // Auto-join voice when user clicks a voice channel
  useEffect(() => {
    if (!pendingVoiceJoin || pendingVoiceJoin !== selectedChannelId || !selectedChannelId) return;
    if (voiceChat.isConnected) {
      setPendingVoiceJoin(null);
      return;
    }
    voiceChat.joinVoice().finally(() => setPendingVoiceJoin(null));
  }, [pendingVoiceJoin, selectedChannelId, voiceChat.isConnected, voiceChat.joinVoice]);

  if (!connected || !identity) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          {connectionTimedOut ? (
            <>
              <h1>{t('auth.connectionFailed')}</h1>
              <p style={{ marginTop: '12px', color: '#b9bbbe', fontSize: '14px' }}>
                {t('auth.connectionFailedHint')}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  background: '#5865f2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {t('auth.retry')}
              </button>
            </>
          ) : (
            <h1>Connecting to SpacetimeDB...</h1>
          )}
        </div>
      </div>
    );
  }

  const currentUser = users.find(u => u.identity.isEqual(identity));
  
  // Show auth screen if user is not authenticated
  if (!currentUser || !currentUser.authMethod) {
    return <AuthScreen />;
  }

  const displayName = currentUser?.name || identity.toHexString().substring(0, 8);

  const handleSendMessage = (text: string) => {
    if (!selectedChannelId) return;
    sendMessage({ text, channelId: selectedChannelId })
      .catch(err => {
        console.error('Error sending message:', err);
        setNotification({
          message: t('errors.sendMessageFailed') + ' ' + (err?.message || ''),
          type: 'error',
        });
      });
  };

  const handleCreateChannel = async (name: string, description?: string, channelType: 'text' | 'voice' = 'text') => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNotification({ message: t('errors.channelNameEmpty'), type: 'error' });
      return;
    }
    if (trimmedName.length > 100) {
      setNotification({ message: t('errors.channelNameTooLong'), type: 'error' });
      return;
    }
    try {
      await createChannel({
        name: trimmedName,
        ...(description?.trim() && { description: description.trim() }),
        type: channelType,
      });
      console.log('Channel created successfully');
      setShowCreateChannelModal(false);
    } catch (err: any) {
      console.error('Error creating channel:', err);
      setNotification({
        message: t('errors.createChannelFailed') + ' ' + (err?.message || String(err)),
        type: 'error',
      });
    }
  };

  const handleSelectChannel = (channelId: bigint) => {
    setPendingVoiceJoin(null); // text channel - no auto-join
    const isMember = channelMembers.some(
      m => m.channelId === channelId && m.userId.isEqual(identity)
    );
    if (!isMember) {
      joinChannel({ channelId })
        .then(() => setSelectedChannelId(channelId))
        .catch(err => {
          console.error('Error joining channel:', err);
          setNotification({ message: t('errors.joinChannelFailed') + ' ' + (err?.message || ''), type: 'error' });
        });
    } else {
      setSelectedChannelId(channelId);
    }
  };

  const handleSelectVoiceChannel = async (channelId: bigint) => {
    const isMember = channelMembers.some(
      m => m.channelId === channelId && m.userId.isEqual(identity)
    );
    if (!isMember) {
      try {
        await joinChannel({ channelId });
      } catch (err: unknown) {
        console.error('Error joining channel:', err);
        setNotification({ message: t('errors.joinChannelFailed') + ' ' + ((err as Error)?.message || ''), type: 'error' });
        return;
      }
    }
    setSelectedChannelId(channelId);
    setPendingVoiceJoin(channelId);
  };

  const handleSubmitName = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNotification({ message: t('errors.displayNameEmpty'), type: 'error' });
      return;
    }
    if (trimmedName.length > 32) {
      setNotification({ message: t('errors.displayNameTooLong'), type: 'error' });
      return;
    }
    
    const userRecord = users.find(u => u.identity.isEqual(identity));
    if (!userRecord) {
      console.warn('User record not found, waiting for user to be created...');
      setNotification({ message: t('errors.userNotReady'), type: 'error' });
      return;
    }
    
    try {
      await setName({ name: trimmedName });
      setShowSettingsModal(false);
    } catch (err: any) {
      console.error('Error setting name:', err);
      setNotification({
        message: t('errors.setNameFailed') + ' ' + (err?.message || String(err)),
        type: 'error',
      });
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        channels={userChannels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={handleSelectChannel}
        onSelectVoiceChannel={handleSelectVoiceChannel}
        onCreateChannel={() => setShowCreateChannelModal(true)}
        voiceChannelParticipants={voiceChannelParticipants}
        voiceControls={
          <VoiceControls
            isConnected={voiceChat.isConnected}
            isMuted={voiceChat.isMuted}
            isDeafened={voiceChat.isDeafened}
            participantsCount={voiceChat.participants.length}
            onLeave={voiceChat.leaveVoice}
            onToggleMute={voiceChat.toggleMute}
            onToggleDeafen={voiceChat.toggleDeafen}
          />
        }
      />
      
      <div className="main-content">
        <div className="channel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <h2>{userChannels.find(c => c.id === selectedChannelId)?.name || t('common.selectChannel')}</h2>
            {selectedChannelId != null ? (
              <>
                {checkPermission(currentUserPermissions, Permissions.ADD_USER) ? (
                  <button
                    className="add-user-btn"
                    onClick={() => setShowAddUserModal(true)}
                    title={t('common.addUser')}
                    style={{
                      background: '#5865f2',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#4752c4'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#5865f2'}
                  >
                    {t('common.addUser')}
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="messages-container">
          {selectedChannelId != null ? (
            <>
              <VoiceRecordings
                channelId={selectedChannelId}
                canListen={
                  checkPermission(currentUserPermissions, Permissions.ADMIN) ||
                  checkPermission(currentUserGlobalPermissions, Permissions.ADMIN)
                }
              />
              <MessageList
                messages={channelMessages as Message[]}
                users={usersMap}
                currentUserId={identity}
                channelName={userChannels.find(c => c.id === selectedChannelId)?.name}
                channelDescription={userChannels.find(c => c.id === selectedChannelId)?.description}
              />
              <MessageInput
                onSubmit={handleSendMessage}
                placeholder={`Message #${userChannels.find(c => c.id === selectedChannelId)?.name || ''}`}
              />
            </>
          ) : userChannels.length === 0 ? (
            <div className="empty-channel">
              <div className="welcome-message">
                <h2>{t('common.welcome')}</h2>
                <p>{t('common.noChannels')}</p>
                <p style={{ marginTop: '16px' }}>
                  {t('common.createFirstChannel')}
                </p>
                <button 
                  className="create-first-channel-btn"
                  onClick={() => setShowCreateChannelModal(true)}
                  style={{
                    marginTop: '24px',
                    padding: '12px 24px',
                    background: '#5865f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#4752c4'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#5865f2'}
                >
                  {t('common.createFirstChannelButton')}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-channel">
              <p>{t('common.selectChannel')}</p>
            </div>
          )}
        </div>
      </div>

      <aside className="right-sidebar">
        <div className="right-sidebar-profile">
          <LanguageSelector />
          <span className="right-sidebar-display-name">{displayName}</span>
          <button
            className="settings-btn"
            onClick={() => setShowSettingsModal(true)}
            title={t('settings.title')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
          >
            ⚙️
          </button>
        </div>
        <UserList 
          users={displayedUsers} 
          currentUserId={identity}
          selectedChannelId={selectedChannelId}
          channelMembers={channelMembers}
          currentUserPermissions={currentUserPermissions}
          currentUserGlobalPermissions={currentUserGlobalPermissions}
          onKickUser={async (userId) => {
            if (!selectedChannelId) return;
            await kickUser({ channelId: selectedChannelId, userId });
          }}
        />
      </aside>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        onCreate={handleCreateChannel}
      />

      {selectedChannelId != null ? (
        <AddUserToChannelModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAdd={async (userId) => {
            await addUserToChannel({ channelId: selectedChannelId, userId });
          }}
          users={Array.from(displayedUsers, u => ({ identity: u.identity, name: u.name, online: u.online }))}
          currentUserId={identity}
          channelMembers={Array.from(channelMembers, m => ({ userId: m.userId, channelId: m.channelId }))}
          channelId={selectedChannelId}
        />
      ) : null}
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        displayName={displayName}
        onSubmitName={handleSubmitName}
        onLogout={logout}
        onOpenRoles={() => {
          setShowSettingsModal(false);
          setShowRoleModal(true);
        }}
        showRolesButton={
          canManageRolesGlobally ||
          (selectedChannelId != null && checkPermission(currentUserPermissions, Permissions.MANAGE_ROLES))
        }
      />
      <RoleManagementModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onGoBack={() => {
          setShowRoleModal(false);
          setShowSettingsModal(true);
        }}
        channelId={selectedChannelId ?? null}
        roles={Array.from(roles, r => ({ id: r.id, channelId: r.channelId, name: r.name, color: r.color, permissions: r.permissions, position: r.position }))}
        roleMembers={Array.from(roleMembers, m => ({ roleId: m.roleId, userId: m.userId }))}
        users={Array.from(displayedUsers, u => ({ identity: u.identity, name: u.name }))}
        currentUserId={identity}
        onCreateRole={async (name, color, permissions, channelId) => {
          // Check if creating global admin role
          const isAdminRole = (permissions & (1n << 63n)) !== 0n;
          
          const roleChannelId = channelId ?? selectedChannelId;
          await createRole({
            ...(!isAdminRole && roleChannelId != null && { channelId: roleChannelId }),
            name,
            color,
            permissions,
          });
        }}
        onAssignRole={async (roleId, userId) => {
          await assignRole({ roleId, userId });
        }}
        onRemoveRole={async (roleId, userId) => {
          await removeRole({ roleId, userId });
        }}
        onDeleteRole={async (roleId) => {
          await deleteRole({ roleId });
        }}
      />
      {notification && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
