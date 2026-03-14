import React, { useState, useMemo } from 'react';
import { Identity } from 'spacetimedb';
import './RoleManagementModal.css';

interface Role {
  id: bigint;
  channelId?: bigint;
  name: string;
  color?: string;
  permissions: bigint;
  position: bigint;
}

interface User {
  identity: Identity;
  name?: string;
}

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId?: bigint | null;
  roles: Role[];
  roleMembers: Array<{ roleId: bigint; userId: Identity }>;
  users: User[];
  currentUserId: Identity;
  onCreateRole: (name: string, color: string, permissions: bigint, channelId?: bigint) => Promise<void>;
  onAssignRole: (roleId: bigint, userId: Identity) => Promise<void>;
  onRemoveRole: (roleId: bigint, userId: Identity) => Promise<void>;
  onDeleteRole: (roleId: bigint) => Promise<void>;
}

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
};

const PERMISSION_GROUPS = [
  {
    name: 'Kanal İzinleri',
    permissions: [
      { flag: Permissions.CREATE_CHANNEL, label: 'Kanal Oluştur' },
      { flag: Permissions.DELETE_CHANNEL, label: 'Kanal Sil' },
      { flag: Permissions.MANAGE_CHANNEL, label: 'Kanal Yönet' },
    ],
  },
  {
    name: 'Mesaj İzinleri',
    permissions: [
      { flag: Permissions.SEND_MESSAGE, label: 'Mesaj Gönder' },
      { flag: Permissions.EDIT_MESSAGE, label: 'Mesaj Düzenle' },
      { flag: Permissions.DELETE_MESSAGE, label: 'Mesaj Sil' },
    ],
  },
  {
    name: 'Kullanıcı Yönetimi',
    permissions: [
      { flag: Permissions.KICK_USER, label: 'Kullanıcı At' },
      { flag: Permissions.BAN_USER, label: 'Kullanıcı Yasakla' },
      { flag: Permissions.ADD_USER, label: 'Kullanıcı Ekle' },
      { flag: Permissions.REMOVE_USER, label: 'Kullanıcı Çıkar' },
    ],
  },
  {
    name: 'Rol Yönetimi',
    permissions: [
      { flag: Permissions.MANAGE_ROLES, label: 'Rolleri Yönet' },
      { flag: Permissions.ASSIGN_ROLES, label: 'Rol Ata' },
    ],
  },
  {
    name: 'Ses İzinleri',
    permissions: [
      { flag: Permissions.JOIN_VOICE, label: 'Sesli Odaya Katıl' },
      { flag: Permissions.SPEAK_IN_VOICE, label: 'Sesli Odada Konuş' },
      { flag: Permissions.MUTE_OTHERS, label: 'Diğerlerini Sustur' },
    ],
  },
  {
    name: 'Özel',
    permissions: [
      { flag: Permissions.ADMIN, label: 'Yönetici (Tüm İzinler)' },
    ],
  },
];

export function RoleManagementModal({
  isOpen,
  onClose,
  channelId,
  roles,
  roleMembers,
  users,
  currentUserId,
  onCreateRole,
  onAssignRole,
  onRemoveRole,
  onDeleteRole,
}: RoleManagementModalProps) {
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#5865f2');
  const [selectedPermissions, setSelectedPermissions] = useState<bigint>(0n);
  const [selectedRoleId, setSelectedRoleId] = useState<bigint | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const channelRoles = useMemo(() => {
    if (!channelId) return [];
    return roles.filter(r => r.channelId === channelId).sort((a, b) => {
      return a.position > b.position ? -1 : a.position < b.position ? 1 : 0;
    });
  }, [roles, channelId]);
  
  const globalRoles = useMemo(() => {
    return roles.filter(r => !r.channelId).sort((a, b) => {
      return a.position > b.position ? -1 : a.position < b.position ? 1 : 0;
    });
  }, [roles]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      setError('Rol adı gereklidir');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Validate permissions before creating
      const allNonAdminPerms = Object.values(Permissions)
        .filter(p => p !== Permissions.ADMIN)
        .reduce((acc, p) => acc | p, 0n);
      
      const hasAllNonAdminPerms = (selectedPermissions & allNonAdminPerms) === allNonAdminPerms;
      const hasAdminPerm = (selectedPermissions & Permissions.ADMIN) !== 0n;
      
      if (hasAllNonAdminPerms && !hasAdminPerm) {
        setError('Tüm izinleri seçmek için Admin izni gereklidir');
        setLoading(false);
        return;
      }
      
      // If creating admin role, set all permissions
      let finalPermissions = selectedPermissions;
      if (selectedPermissions & Permissions.ADMIN) {
        // Admin role gets all permissions
        finalPermissions = Object.values(Permissions).reduce((acc, perm) => acc | perm, 0n);
      }
      
      await onCreateRole(newRoleName.trim(), newRoleColor, finalPermissions, channelId ?? undefined);
      setNewRoleName('');
      setNewRoleColor('#5865f2');
      setSelectedPermissions(0n);
      setShowCreateRole(false);
    } catch (err: any) {
      setError(err?.message || 'Rol oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId || !selectedUserId) {
      setError('Lütfen rol ve kullanıcı seçin');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = users.find(u => u.identity.toHexString() === selectedUserId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      await onAssignRole(selectedRoleId, user.identity);
      setSelectedRoleId(null);
      setSelectedUserId(null);
    } catch (err: any) {
      setError(err?.message || 'Rol atanamadı');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission: bigint) => {
    const isAdmin = permission === Permissions.ADMIN;
    
    if (isAdmin) {
      // Toggle admin - if checked, set all permissions; if unchecked, clear all
      if (selectedPermissions & Permissions.ADMIN) {
        setSelectedPermissions(0n);
        setError(''); // Clear errors
      } else {
        const allPerms = Object.values(Permissions).reduce((acc, p) => acc | p, 0n);
        setSelectedPermissions(allPerms);
        setError(''); // Clear errors
      }
    } else {
      // If admin is selected, can't toggle individual permissions
      if (selectedPermissions & Permissions.ADMIN) {
        return; // Admin selected, individual permissions are locked
      }
      
      // Calculate all non-admin permissions
      const allNonAdminPerms = Object.values(Permissions)
        .filter(p => p !== Permissions.ADMIN)
        .reduce((acc, p) => acc | p, 0n);
      
      // Check if selecting this permission would give all non-admin permissions
      const newPerms = selectedPermissions | permission;
      const currentNonAdminPerms = selectedPermissions & allNonAdminPerms;
      const wouldHaveAllNonAdminPerms = (newPerms & allNonAdminPerms) === allNonAdminPerms;
      
      // Prevent selecting all permissions without admin flag
      if (wouldHaveAllNonAdminPerms && !(selectedPermissions & Permissions.ADMIN)) {
        setError('Tüm izinleri seçmek için Admin izni gereklidir. Lütfen önce "Yönetici" seçeneğini işaretleyin.');
        return;
      }
      
      // Normal toggle
      if (selectedPermissions & permission) {
        setSelectedPermissions(selectedPermissions & ~permission);
        setError(''); // Clear errors when unchecking
      } else {
        setSelectedPermissions(selectedPermissions | permission);
        setError(''); // Clear errors when checking
      }
    }
  };

  const getUsersForRole = (roleId: bigint) => {
    return roleMembers
      .filter(rm => rm.roleId === roleId)
      .map(rm => users.find(u => u.identity.isEqual(rm.userId)))
      .filter(u => u !== undefined) as User[];
  };

  const getAvailableUsers = (roleId: bigint) => {
    const assignedUserIds = new Set(
      roleMembers
        .filter(rm => rm.roleId === roleId)
        .map(rm => rm.userId.toHexString())
    );
    return users.filter(u => !assignedUserIds.has(u.identity.toHexString()));
  };

  // Check if current user can delete a role (prevent admin from deleting admin roles)
  const canDeleteRole = (role: Role): { canDelete: boolean; reason?: string } => {
    // If it's an admin role
    if ((role.permissions & Permissions.ADMIN) !== 0n) {
      // Get all users assigned to this admin role
      const roleUsers = roleMembers.filter(rm => rm.roleId === role.id);
      
      // Check if current user is assigned to this admin role
      const userRoleMembers = roleUsers.filter(
        rm => rm.userId.isEqual(currentUserId)
      );
      
      // Admin cannot delete their own admin role
      if (userRoleMembers.length > 0) {
        return { canDelete: false, reason: 'Kendi adminliğinizi silemezsiniz' };
      }
      
      // Admin cannot delete other users' admin roles
      if (roleUsers.length > 0) {
        return { canDelete: false, reason: 'Başka bir kullanıcının admin rolünü silemezsiniz' };
      }
    }
    return { canDelete: true };
  };

  // Check if current user can remove a role from a user (prevent removing admin roles)
  const canRemoveRole = (role: Role, targetUserId: Identity): boolean => {
    // Admin roles cannot be removed from anyone
    if ((role.permissions & Permissions.ADMIN) !== 0n) {
      return false;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content role-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rol Yönetimi</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          {!showCreateRole ? (
            <>
              {channelId && (
                <div className="role-list">
                  <div className="section-header">
                    <h3>Kanal Rolleri</h3>
                    <button
                      className="btn-primary"
                      onClick={() => setShowCreateRole(true)}
                      disabled={loading}
                    >
                      + Yeni Rol
                    </button>
                  </div>

                  {channelRoles.length === 0 ? (
                    <p className="no-items">Bu kanal için henüz rol yok</p>
                  ) : (
                  channelRoles.map((role) => {
                    const roleUsers = getUsersForRole(role.id);
                    return (
                      <div key={role.id.toString()} className="role-item">
                        <div className="role-info">
                          <div
                            className="role-color"
                            style={{ backgroundColor: role.color || '#5865f2' }}
                          />
                          <div>
                            <div className="role-name">{role.name}</div>
                            <div className="role-users">
                              {roleUsers.length} kullanıcı
                            </div>
                          </div>
                        </div>
                        <div className="role-actions">
                          <select
                            value={selectedUserId || ''}
                            onChange={(e) => {
                              setSelectedRoleId(role.id);
                              setSelectedUserId(e.target.value);
                            }}
                            disabled={loading}
                            className="user-select-small"
                          >
                            <option value="">Kullanıcı seç...</option>
                            {getAvailableUsers(role.id).map((user) => (
                              <option
                                key={user.identity.toHexString()}
                                value={user.identity.toHexString()}
                              >
                                {user.name || user.identity.toHexString().substring(0, 8)}
                              </option>
                            ))}
                          </select>
                          {selectedRoleId === role.id && selectedUserId && (
                            <button
                              className="btn-small"
                              onClick={handleAssignRole}
                              disabled={loading}
                            >
                              Ata
                            </button>
                          )}
                          {(() => {
                            const deleteCheck = canDeleteRole(role);
                            return (
                              <button
                                className="btn-danger btn-small"
                                onClick={() => onDeleteRole(role.id)}
                                disabled={loading || !deleteCheck.canDelete}
                                title={deleteCheck.reason || 'Rolü Sil'}
                              >
                                Sil
                              </button>
                            );
                          })()}
                        </div>
                        {roleUsers.length > 0 && (
                          <div className="role-members">
                            {roleUsers.map((user) => (
                              <div key={user.identity.toHexString()} className="role-member">
                                <span>{user.name || user.identity.toHexString().substring(0, 8)}</span>
                                <button
                                  className="btn-remove"
                                  onClick={() => onRemoveRole(role.id, user.identity)}
                                  disabled={loading || !canRemoveRole(role, user.identity)}
                                  title={!canRemoveRole(role, user.identity) ? 'Admin rolü kaldırılamaz' : 'Rolü Kaldır'}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                  )}
                </div>
              )}
              
              <div className="role-list" style={{ marginTop: channelId ? '24px' : '0' }}>
                <div className="section-header">
                  <h3>Global Roller (Tüm Kanallar İçin)</h3>
                  <button
                    className="btn-primary"
                    onClick={() => setShowCreateRole(true)}
                    disabled={loading}
                  >
                    + Yeni Rol
                  </button>
                </div>
                
                {globalRoles.length === 0 ? (
                  <p className="no-items">Henüz global rol yok</p>
                ) : (
                  globalRoles.map((role) => {
                    const roleUsers = getUsersForRole(role.id);
                    return (
                      <div key={role.id.toString()} className="role-item">
                        <div className="role-info">
                          <div
                            className="role-color"
                            style={{ backgroundColor: role.color || '#5865f2' }}
                          />
                          <div>
                            <div className="role-name">
                              {role.name}
                              <span style={{ fontSize: '12px', color: '#72767d', marginLeft: '8px' }}>
                                (Global)
                              </span>
                            </div>
                            <div className="role-users">
                              {roleUsers.length} kullanıcı
                            </div>
                          </div>
                        </div>
                        <div className="role-actions">
                          <select
                            value={selectedUserId || ''}
                            onChange={(e) => {
                              setSelectedRoleId(role.id);
                              setSelectedUserId(e.target.value);
                            }}
                            disabled={loading}
                            className="user-select-small"
                          >
                            <option value="">Kullanıcı seç...</option>
                            {getAvailableUsers(role.id).map((user) => (
                              <option
                                key={user.identity.toHexString()}
                                value={user.identity.toHexString()}
                              >
                                {user.name || user.identity.toHexString().substring(0, 8)}
                              </option>
                            ))}
                          </select>
                          {selectedRoleId === role.id && selectedUserId && (
                            <button
                              className="btn-small"
                              onClick={handleAssignRole}
                              disabled={loading}
                            >
                              Ata
                            </button>
                          )}
                          {(() => {
                            const deleteCheck = canDeleteRole(role);
                            return (
                              <button
                                className="btn-danger btn-small"
                                onClick={() => onDeleteRole(role.id)}
                                disabled={loading || !deleteCheck.canDelete}
                                title={deleteCheck.reason || 'Rolü Sil'}
                              >
                                Sil
                              </button>
                            );
                          })()}
                        </div>
                        {roleUsers.length > 0 && (
                          <div className="role-members">
                            {roleUsers.map((user) => (
                              <div key={user.identity.toHexString()} className="role-member">
                                <span>{user.name || user.identity.toHexString().substring(0, 8)}</span>
                                <button
                                  className="btn-remove"
                                  onClick={() => onRemoveRole(role.id, user.identity)}
                                  disabled={loading || !canRemoveRole(role, user.identity)}
                                  title={!canRemoveRole(role, user.identity) ? 'Admin rolü kaldırılamaz' : 'Rolü Kaldır'}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="create-role-form">
              <h3>Yeni Rol Oluştur</h3>
              
              <div className="form-group">
                <label>Rol Adı</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Örn: Moderator"
                  maxLength={32}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Renk</label>
                <input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>İzinler</label>
                <div className="permissions-grid">
                  {PERMISSION_GROUPS.map((group) => (
                    <div key={group.name} className="permission-group">
                      <div className="permission-group-title">{group.name}</div>
                      {group.permissions.map((perm) => {
                        const isAdmin = perm.flag === Permissions.ADMIN;
                        const isChecked = isAdmin 
                          ? (selectedPermissions & Permissions.ADMIN) !== 0n
                          : (selectedPermissions & perm.flag) !== 0n;
                        
                        // Check if admin is selected - if so, disable individual permissions
                        const adminSelected = (selectedPermissions & Permissions.ADMIN) !== 0n;
                        const isDisabled = !isAdmin && adminSelected;
                        
                        return (
                          <label 
                            key={perm.flag.toString()} 
                            className={`permission-checkbox ${isDisabled ? 'disabled' : ''}`}
                            style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isAdmin) {
                                  // Toggle admin - if checked, set all permissions
                                  if (!isChecked) {
                                    const allPerms = Object.values(Permissions).reduce((acc, p) => acc | p, 0n);
                                    setSelectedPermissions(allPerms);
                                    setError(''); // Clear any previous errors
                                  } else {
                                    setSelectedPermissions(0n);
                                  }
                                } else {
                                  togglePermission(perm.flag);
                                }
                              }}
                              disabled={loading || isDisabled}
                            />
                            <span>{perm.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px', padding: '8px', background: '#202225', borderRadius: '4px', fontSize: '12px', color: '#72767d' }}>
                  💡 <strong>İpucu:</strong> "Yönetici" seçeneğini işaretlerseniz tüm izinler otomatik olarak verilir. Admin olmadan tüm izinleri seçemezsiniz.
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateRole(false);
                    setNewRoleName('');
                    setSelectedPermissions(0n);
                  }}
                  disabled={loading}
                >
                  İptal
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateRole}
                  disabled={loading || !newRoleName.trim()}
                >
                  {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
