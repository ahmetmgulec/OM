// ─────────────────────────────────────────────────────────────────────────────
// SPACETIMEDB MODULE - Discord Clone Backend
// ─────────────────────────────────────────────────────────────────────────────
import { schema, t, table, SenderError } from 'spacetimedb/server';

const user = table(
  { 
    name: 'user', 
    public: true,
    indexes: []
  },
  {
    identity: t.identity().primaryKey(),
    name: t.string().optional(),
    online: t.bool(),
    avatar: t.string().optional(),
    authMethod: t.string().optional(), // 'email', 'google', or undefined for anonymous
    lastIpAddress: t.string().optional(), // Last known IP address (only visible to admins)
  }
);

const channel = table(
  {
    name: 'channel',
    public: true,
    indexes: [],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    name: t.string(),
    description: t.string().optional(),
    type: t.string(), // 'text' | 'voice'
    createdAt: t.timestamp(),
    createdBy: t.identity().optional(),
  }
);

const thread = table(
  {
    name: 'thread',
    public: true,
    indexes: [
      { accessor: 'thread_by_channel', name: 'thread_by_channel', algorithm: 'btree', columns: ['channelId'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    channelId: t.u64(),
    name: t.string(),
    createdAt: t.timestamp(),
    createdBy: t.identity().optional(),
  }
);

const message = table(
  {
    name: 'message',
    public: true,
    indexes: [
      { accessor: 'message_by_sender', name: 'message_by_sender', algorithm: 'btree', columns: ['sender'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    sender: t.identity(),
    channelId: t.u64().optional(),
    threadId: t.u64().optional(),
    text: t.string(),
    sent: t.timestamp(),
    editedAt: t.timestamp().optional(),
  }
);

const channelMember = table(
  {
    name: 'channelMember',
    public: true,
    indexes: [
      { accessor: 'channel_member_by_channel', name: 'channel_member_by_channel', algorithm: 'btree', columns: ['channelId'] },
      // NOTE: Index on userId (identity) causes HTTP 500 error - removed for now
      // We can still query by iterating and filtering, though it's less efficient
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    channelId: t.u64(),
    userId: t.identity(),
    joinedAt: t.timestamp(),
  }
);

// Authentication tables
const emailCredential = table(
  {
    name: 'emailCredential',
    public: false, // Private table - only accessible via reducers
    indexes: [], // No manual indexes needed - primary key 'email' is automatically indexed
  },
  {
    email: t.string().primaryKey(),
    passwordHash: t.string(), // Simple hash for now - in production use proper bcrypt
    identity: t.identity(),
    createdAt: t.timestamp(),
  }
);

const googleAuth = table(
  {
    name: 'googleAuth',
    public: false, // Private table - only accessible via reducers
    indexes: [], // No manual indexes needed - primary key 'googleId' is automatically indexed
  },
  {
    googleId: t.string().primaryKey(),
    identity: t.identity(),
    email: t.string().optional(),
    name: t.string().optional(),
    avatar: t.string().optional(),
    createdAt: t.timestamp(),
  }
);

// Voice room tables
const voiceRoom = table(
  {
    name: 'voiceRoom',
    public: true,
    indexes: [
      { accessor: 'voice_room_by_channel', name: 'voice_room_by_channel', algorithm: 'btree', columns: ['channelId'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    channelId: t.u64(),
    createdAt: t.timestamp(),
  }
);

const voiceParticipant = table(
  {
    name: 'voiceParticipant',
    public: true,
    indexes: [
      { accessor: 'voice_participant_by_room', name: 'voice_participant_by_room', algorithm: 'btree', columns: ['roomId'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    roomId: t.u64(),
    userId: t.identity(),
    muted: t.bool(),
    deafened: t.bool(),
    joinedAt: t.timestamp(),
  }
);

const voiceSignaling = table(
  {
    name: 'voiceSignaling',
    public: true,
    indexes: [
      { accessor: 'voice_signaling_by_room', name: 'voice_signaling_by_room', algorithm: 'btree', columns: ['roomId'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    roomId: t.u64(),
    fromUserId: t.identity(),
    toUserId: t.identity(),
    signalType: t.string(), // 'offer', 'answer', 'ice-candidate'
    signalData: t.string(), // JSON stringified signal data
    createdAt: t.timestamp(),
  }
);

// Voice recording chunks - auto-saved when voice room is active
const voiceRecordingChunk = table(
  {
    name: 'voiceRecordingChunk',
    public: true,
    indexes: [
      { accessor: 'voice_recording_by_room', name: 'voice_recording_by_room', algorithm: 'btree', columns: ['roomId'] },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    roomId: t.u64(),
    channelId: t.u64(),
    chunkIndex: t.u64(),
    dataBase64: t.string(), // Base64-encoded audio chunk (~32KB max per chunk)
    recordedBy: t.identity(),
    createdAt: t.timestamp(),
  }
);

// Role and permission tables
const role = table(
  {
    name: 'role',
    public: true,
    indexes: [], // Note: Can't index optional fields efficiently, will filter manually
  },
  {
    id: t.u64().primaryKey().autoInc(),
    channelId: t.u64().optional(), // null for global roles
    name: t.string(),
    color: t.string().optional(), // Hex color code
    permissions: t.u64(), // Bitmask for permissions
    position: t.u64(), // Higher = more priority
    createdAt: t.timestamp(),
    createdBy: t.identity().optional(),
  }
);

const roleMember = table(
  {
    name: 'roleMember',
    public: true,
    indexes: [
      { accessor: 'role_member_by_role', name: 'role_member_by_role', algorithm: 'btree', columns: ['roleId'] },
      // Note: Can't index identity fields directly, will filter manually
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    roleId: t.u64(),
    userId: t.identity(),
    assignedAt: t.timestamp(),
    assignedBy: t.identity().optional(),
  }
);

// Tracks identities replaced during login migration (old session -> new session)
// Client filters these out to avoid duplicate user entries in the list
const replacedIdentity = table(
  {
    name: 'replacedIdentity',
    public: true,
    indexes: [],
  },
  {
    oldIdentity: t.identity().primaryKey(),
    newIdentity: t.identity(),
    replacedAt: t.timestamp(),
  }
);

const spacetimedb = schema({ 
  user, channel, thread, message, channelMember, emailCredential, googleAuth,
  voiceRoom, voiceParticipant, voiceSignaling, voiceRecordingChunk,
  role, roleMember, replacedIdentity
});
export default spacetimedb;

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

// Permission flags (bitmask)
const Permissions = {
  // Channel permissions
  CREATE_CHANNEL: 1n << 0n,
  DELETE_CHANNEL: 1n << 1n,
  MANAGE_CHANNEL: 1n << 2n,
  
  // Message permissions
  SEND_MESSAGE: 1n << 3n,
  EDIT_MESSAGE: 1n << 4n,
  DELETE_MESSAGE: 1n << 5n,
  
  // User management
  KICK_USER: 1n << 6n,
  BAN_USER: 1n << 7n,
  ADD_USER: 1n << 8n,
  REMOVE_USER: 1n << 9n,
  
  // Role management
  MANAGE_ROLES: 1n << 10n,
  ASSIGN_ROLES: 1n << 11n,
  
  // Voice permissions
  JOIN_VOICE: 1n << 12n,
  SPEAK_IN_VOICE: 1n << 13n,
  MUTE_OTHERS: 1n << 14n,
  
  // Admin (all permissions)
  ADMIN: 1n << 63n,
} as const;

// Helper function to check if user has permission
function checkPermission(userPermissions: bigint, permission: bigint): boolean {
  // Admin has all permissions
  if ((userPermissions & Permissions.ADMIN) !== 0n) {
    return true;
  }
  return (userPermissions & permission) !== 0n;
}

// Get user's effective permissions for a channel
function getUserChannelPermissions(
  ctx: any,
  userId: any,
  channelId: bigint
): bigint {
  let permissions = 0n;
  
  // Get all roles for this user
  const userRoles = [...ctx.db.roleMember.iter()].filter(
    rm => rm.userId.isEqual(userId)
  );
  
  // Get channel-specific roles and global roles
  const channelRoles = [...ctx.db.role.iter()].filter(
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
  const channelMembers = [...ctx.db.channelMember.iter()].filter(
    m => m.channelId === channelId
  );
  const isMember = channelMembers.some(m => m.userId.isEqual(userId));
  
  if (isMember) {
    // Basic member permissions
    permissions |= Permissions.SEND_MESSAGE;
    permissions |= Permissions.JOIN_VOICE;
    permissions |= Permissions.SPEAK_IN_VOICE;
  }
  
  return permissions;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function validateName(name: string) {
  if (!name || name.trim().length === 0) {
    throw new SenderError('Names must not be empty');
  }
  if (name.length > 32) {
    throw new SenderError('Names must be 32 characters or less');
  }
}

function validateMessage(text: string) {
  if (!text || text.trim().length === 0) {
    throw new SenderError('Messages must not be empty');
  }
  if (text.length > 2000) {
    throw new SenderError('Messages must be 2000 characters or less');
  }
}

function validateChannelName(name: string) {
  if (!name || name.trim().length === 0) {
    throw new SenderError('Channel names must not be empty');
  }
  if (name.length > 100) {
    throw new SenderError('Channel names must be 100 characters or less');
  }
}

function validateEmail(email: string) {
  if (!email || email.trim().length === 0) {
    throw new SenderError('Email must not be empty');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new SenderError('Invalid email format');
  }
  if (email.length > 255) {
    throw new SenderError('Email must be 255 characters or less');
  }
}

function validatePassword(password: string) {
  if (!password || password.length === 0) {
    throw new SenderError('Password must not be empty');
  }
  if (password.length < 6) {
    throw new SenderError('Password must be at least 6 characters');
  }
  if (password.length > 128) {
    throw new SenderError('Password must be 128 characters or less');
  }
}

// Simple hash function - in production, use proper bcrypt
function hashPassword(password: string): string {
  // Simple hash for demo - replace with proper bcrypt in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ─────────────────────────────────────────────────────────────────────────────
// REDUCERS
// ─────────────────────────────────────────────────────────────────────────────

export const set_name = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    validateName(name);
    const user = ctx.db.user.identity.find(ctx.sender);
    if (!user) {
      throw new SenderError('Cannot set name for unknown user');
    }
    console.info(`User ${ctx.sender} sets name to ${name}`);
    // Update user with new name - ensure all fields are included
    ctx.db.user.identity.update({
      identity: user.identity,
      name: name, // Set the name (optional field)
      online: user.online,
      avatar: user.avatar,
      authMethod: user.authMethod,
      lastIpAddress: user.lastIpAddress,
    });
  }
);

export const create_channel = spacetimedb.reducer(
  { name: t.string(), description: t.string().optional(), type: t.string() },
  (ctx, { name, description, type }) => {
    validateChannelName(name);
    if (type !== 'text' && type !== 'voice') {
      throw new SenderError('Channel type must be "text" or "voice"');
    }
    
    // Check if user has CREATE_CHANNEL permission (global check)
    const userRoles = [...ctx.db.roleMember.iter()].filter(rm => rm.userId.isEqual(ctx.sender));
    const globalRoles = [...ctx.db.role.iter()].filter(r => !r.channelId);
    const userGlobalRoles = userRoles
      .map(rm => globalRoles.find(r => r.id === rm.roleId))
      .filter(r => r !== undefined);
    
    let hasCreatePermission = false;
    userGlobalRoles.forEach(role => {
      if (role && checkPermission(role.permissions, Permissions.CREATE_CHANNEL)) {
        hasCreatePermission = true;
      }
    });
    
    // If no global roles, allow creation (default behavior for new users)
    if (userGlobalRoles.length > 0 && !hasCreatePermission) {
      throw new SenderError('You do not have permission to create channels');
    }
    
    const channel = ctx.db.channel.insert({
      id: 0n,
      name,
      description,
      type,
      createdAt: ctx.timestamp,
      createdBy: ctx.sender,
    });
    
    ctx.db.channelMember.insert({
      id: 0n,
      channelId: channel.id,
      userId: ctx.sender,
      joinedAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} created channel ${name} (${channel.id})`);
  }
);

export const create_thread = spacetimedb.reducer(
  { channelId: t.u64(), name: t.string() },
  (ctx, { channelId, name }) => {
    validateChannelName(name);
    const channel = ctx.db.channel.id.find(channelId);
    if (!channel) {
      throw new SenderError('Channel not found');
    }
    
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const member = channelMembers.find(m => m.userId.isEqual(ctx.sender));
    
    if (!member) {
      throw new SenderError('You must be a member of the channel to create threads');
    }
    
    const thread = ctx.db.thread.insert({
      id: 0n,
      channelId,
      name,
      createdAt: ctx.timestamp,
      createdBy: ctx.sender,
    });
    
    console.info(`User ${ctx.sender} created thread ${name} in channel ${channelId} (${thread.id})`);
  }
);

export const join_channel = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const channel = ctx.db.channel.id.find(channelId);
    if (!channel) {
      throw new SenderError('Channel not found');
    }
    
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const existingMember = channelMembers.find(m => m.userId.isEqual(ctx.sender));
    
    if (existingMember) {
      throw new SenderError('You are already a member of this channel');
    }
    
    ctx.db.channelMember.insert({
      id: 0n,
      channelId,
      userId: ctx.sender,
      joinedAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} joined channel ${channelId}`);
  }
);

export const add_user_to_channel = spacetimedb.reducer(
  { channelId: t.u64(), userId: t.identity() },
  (ctx, { channelId, userId }) => {
    const channel = ctx.db.channel.id.find(channelId);
    if (!channel) {
      throw new SenderError('Channel not found');
    }
    
    // Check permissions
    const userPerms = getUserChannelPermissions(ctx, ctx.sender, channelId);
    if (!checkPermission(userPerms, Permissions.ADD_USER)) {
      throw new SenderError('You do not have permission to add users to this channel');
    }
    
    // Check if user exists
    const user = ctx.db.user.identity.find(userId);
    if (!user) {
      throw new SenderError('User not found');
    }
    
    // Check if user is already a member
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const existingMember = channelMembers.find(m => m.userId.isEqual(userId));
    if (existingMember) {
      throw new SenderError('User is already a member of this channel');
    }
    
    // Add user to channel
    ctx.db.channelMember.insert({
      id: 0n,
      channelId,
      userId,
      joinedAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} added user ${userId} to channel ${channelId}`);
  }
);

export const leave_channel = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const member = channelMembers.find(m => m.userId.isEqual(ctx.sender));
    
    if (!member) {
      throw new SenderError('You are not a member of this channel');
    }
    
    ctx.db.channelMember.delete(member);
    console.info(`User ${ctx.sender} left channel ${channelId}`);
  }
);

export const kick_user = spacetimedb.reducer(
  { channelId: t.u64(), userId: t.identity() },
  (ctx, { channelId, userId }) => {
    const channel = ctx.db.channel.id.find(channelId);
    if (!channel) {
      throw new SenderError('Channel not found');
    }
    
    // Check permissions
    const userPerms = getUserChannelPermissions(ctx, ctx.sender, channelId);
    if (!checkPermission(userPerms, Permissions.KICK_USER)) {
      throw new SenderError('You do not have permission to kick users from this channel');
    }
    
    // Check if user exists
    const user = ctx.db.user.identity.find(userId);
    if (!user) {
      throw new SenderError('User not found');
    }
    
    // Prevent kicking yourself (use leave_channel instead)
    if (userId.isEqual(ctx.sender)) {
      throw new SenderError('You cannot kick yourself. Use leave channel instead.');
    }
    
    // Check if user is a member of the channel
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const member = channelMembers.find(m => m.userId.isEqual(userId));
    
    if (!member) {
      throw new SenderError('User is not a member of this channel');
    }
    
    // Remove user from channel
    ctx.db.channelMember.delete(member);
    
    console.info(`User ${ctx.sender} kicked user ${userId} from channel ${channelId}`);
  }
);

export const send_message = spacetimedb.reducer(
  { 
    text: t.string(), 
    channelId: t.u64().optional(), 
    threadId: t.u64().optional() 
  },
  (ctx, { text, channelId, threadId }) => {
    validateMessage(text);
    
    if (!channelId && !threadId) {
      throw new SenderError('Must specify either channelId or threadId');
    }
    if (channelId && threadId) {
      throw new SenderError('Cannot specify both channelId and threadId');
    }
    
    if (channelId) {
      const channel = ctx.db.channel.id.find(channelId);
      if (!channel) {
        throw new SenderError('Channel not found');
      }
      
      // Check permissions
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, channelId);
      if (!checkPermission(userPerms, Permissions.SEND_MESSAGE)) {
        throw new SenderError('You do not have permission to send messages in this channel');
      }
    }
    
    if (threadId) {
      const thread = ctx.db.thread.id.find(threadId);
      if (!thread) {
        throw new SenderError('Thread not found');
      }
      
      const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === thread.channelId);
      const member = channelMembers.find(m => m.userId.isEqual(ctx.sender));
      
      if (!member) {
        throw new SenderError('You must be a member of the channel to send messages in threads');
      }
    }
    
    ctx.db.message.insert({
      id: 0n,
      sender: ctx.sender,
      channelId: channelId ?? undefined,
      threadId: threadId ?? undefined,
      text,
      sent: ctx.timestamp,
      editedAt: undefined,
    });
    
    console.info(`User ${ctx.sender} sent message in ${channelId ? `channel ${channelId}` : `thread ${threadId}`}`);
  }
);

export const edit_message = spacetimedb.reducer(
  { messageId: t.u64(), text: t.string() },
  (ctx, { messageId, text }) => {
    validateMessage(text);
    const message = ctx.db.message.id.find(messageId);
    if (!message) {
      throw new SenderError('Message not found');
    }
    
    // Check permissions - can edit own messages or need EDIT_MESSAGE permission
    const isOwnMessage = message.sender.isEqual(ctx.sender);
    if (!isOwnMessage && message.channelId) {
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, message.channelId);
      if (!checkPermission(userPerms, Permissions.EDIT_MESSAGE)) {
        throw new SenderError('You do not have permission to edit messages');
      }
    } else if (!isOwnMessage) {
      throw new SenderError('You can only edit your own messages');
    }
    
    ctx.db.message.id.update({
      ...message,
      text,
      editedAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} edited message ${messageId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION REDUCERS
// ─────────────────────────────────────────────────────────────────────────────

export const signup_email = spacetimedb.reducer(
  { email: t.string(), password: t.string(), name: t.string().optional() },
  (ctx, { email, password, name }) => {
    const normalizedEmail = email.toLowerCase().trim();
    validateEmail(normalizedEmail);
    validatePassword(password);
    
    // Check if email already exists
    const existingCredential = ctx.db.emailCredential.email.find(normalizedEmail);
    if (existingCredential) {
      throw new SenderError('Email already registered');
    }
    
    // Hash password
    const passwordHash = hashPassword(password);
    
    // Check if user already exists
    let user = ctx.db.user.identity.find(ctx.sender);
    if (user) {
      // Update existing user
      ctx.db.user.identity.update({
        ...user,
        name: name?.trim() || user.name,
        online: true,
        authMethod: 'email',
        lastIpAddress: user.lastIpAddress, // Keep existing IP
      });
    } else {
      // Create new user record
      user = ctx.db.user.insert({
        identity: ctx.sender,
        name: name?.trim() || undefined,
        online: true,
        avatar: undefined,
        authMethod: 'email',
        lastIpAddress: undefined, // Will be set on next connection
      });
      
      // If this is the first authenticated user and no admin role exists, make them admin
      const allUsers = [...ctx.db.user.iter()];
      const authenticatedUsers = allUsers.filter(u => u.authMethod);
      const allRoles = [...ctx.db.role.iter()];
      const hasAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (authenticatedUsers.length === 1 && !hasAdminRole) {
        try {
          const adminRole = ctx.db.role.insert({
            id: 0n,
            channelId: undefined,
            name: 'Admin',
            color: '#f04747',
            permissions: Permissions.ADMIN,
            position: 1000n,
            createdAt: ctx.timestamp,
            createdBy: ctx.sender,
          });
          
          ctx.db.roleMember.insert({
            id: 0n,
            roleId: adminRole.id,
            userId: ctx.sender,
            assignedAt: ctx.timestamp,
            assignedBy: undefined,
          });
          
          console.info(`First authenticated user ${ctx.sender} automatically assigned admin role`);
        } catch (err) {
          console.error('Error creating admin role:', err);
        }
      }
    }
    
    // Create email credential
    ctx.db.emailCredential.insert({
      email: normalizedEmail,
      passwordHash,
      identity: ctx.sender,
      createdAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} signed up with email ${normalizedEmail}`);
  }
);

export const login_email = spacetimedb.reducer(
  { email: t.string(), password: t.string() },
  (ctx, { email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();
    validateEmail(normalizedEmail);
    validatePassword(password);
    
    // Find credential
    const credential = ctx.db.emailCredential.email.find(normalizedEmail);
    if (!credential) {
      throw new SenderError('Invalid email or password');
    }
    
    // Verify password
    if (!verifyPassword(password, credential.passwordHash)) {
      throw new SenderError('Invalid email or password');
    }
    
    // Auth the current connection (ctx.sender) - client gets a new identity each time
    // when connecting without token, so we must update ctx.sender's user, not credential.identity's
    const originalUser = ctx.db.user.identity.find(credential.identity);
    let user = ctx.db.user.identity.find(ctx.sender);
    if (!user) {
      user = ctx.db.user.insert({
        identity: ctx.sender,
        name: originalUser?.name,
        online: true,
        avatar: originalUser?.avatar,
        authMethod: 'email',
        lastIpAddress: undefined,
      });
    } else {
      ctx.db.user.identity.update({
        ...user,
        name: user.name ?? originalUser?.name,
        online: true,
        authMethod: 'email',
        lastIpAddress: user.lastIpAddress,
      });
    }

    // Copy role memberships from original account (admin, channel roles, etc.)
    const originalRoleMembers = [...ctx.db.roleMember.iter()].filter(
      rm => rm.userId.isEqual(credential.identity)
    );
    for (const rm of originalRoleMembers) {
      const alreadyAssigned = [...ctx.db.roleMember.iter()].some(
        m => m.roleId === rm.roleId && m.userId.isEqual(ctx.sender)
      );
      if (!alreadyAssigned) {
        ctx.db.roleMember.insert({
          id: 0n,
          roleId: rm.roleId,
          userId: ctx.sender,
          assignedAt: ctx.timestamp,
          assignedBy: rm.assignedBy,
        });
      }
    }

    // Copy channel memberships from original account
    const originalChannelMembers = [...ctx.db.channelMember.iter()].filter(
      m => m.userId.isEqual(credential.identity)
    );
    for (const m of originalChannelMembers) {
      const alreadyMember = [...ctx.db.channelMember.iter()].some(
        cm => cm.channelId === m.channelId && cm.userId.isEqual(ctx.sender)
      );
      if (!alreadyMember) {
        ctx.db.channelMember.insert({
          id: 0n,
          channelId: m.channelId,
          userId: ctx.sender,
          joinedAt: ctx.timestamp,
        });
      }
    }

    // When migrating to new identity: mark old as replaced and remove old memberships
    // so the old session doesn't appear as duplicate offline in the user list
    if (!credential.identity.isEqual(ctx.sender)) {
      const existing = ctx.db.replacedIdentity.oldIdentity.find(credential.identity);
      if (existing) {
        ctx.db.replacedIdentity.oldIdentity.update({
          ...existing,
          newIdentity: ctx.sender,
          replacedAt: ctx.timestamp,
        });
      } else {
        ctx.db.replacedIdentity.insert({
          oldIdentity: credential.identity,
          newIdentity: ctx.sender,
          replacedAt: ctx.timestamp,
        });
      }
      // Remove old channel/role memberships so we don't have double entries
      for (const m of originalChannelMembers) {
        ctx.db.channelMember.delete(m);
      }
      for (const rm of originalRoleMembers) {
        ctx.db.roleMember.delete(rm);
      }
      // Update credential so future logins copy from this identity
      ctx.db.emailCredential.email.update({ ...credential, identity: ctx.sender });
    }
    
    console.info(`User ${ctx.sender} logged in with email ${normalizedEmail}`);
  }
);

export const signup_google = spacetimedb.reducer(
  { 
    googleId: t.string(), 
    email: t.string().optional(), 
    name: t.string().optional(),
    avatar: t.string().optional()
  },
  (ctx, { googleId, email, name, avatar }) => {
    if (!googleId || googleId.trim().length === 0) {
      throw new SenderError('Google ID is required');
    }
    
    // Check if Google ID already exists
    const existingAuth = ctx.db.googleAuth.googleId.find(googleId);
    if (existingAuth) {
      throw new SenderError('Google account already registered');
    }
    
    // Check if user already exists
    let user = ctx.db.user.identity.find(ctx.sender);
    if (user) {
      // Update existing user
      ctx.db.user.identity.update({
        ...user,
        name: name?.trim() || user.name,
        online: true,
        avatar: avatar || user.avatar,
        authMethod: 'google',
        lastIpAddress: user.lastIpAddress, // Keep existing IP
      });
    } else {
      // Create new user record
      user = ctx.db.user.insert({
        identity: ctx.sender,
        name: name?.trim() || undefined,
        online: true,
        avatar: avatar || undefined,
        authMethod: 'google',
        lastIpAddress: undefined, // Will be set on next connection
      });
      
      // If this is the first authenticated user and no admin role exists, make them admin
      const allUsers = [...ctx.db.user.iter()];
      const authenticatedUsers = allUsers.filter(u => u.authMethod);
      const allRoles = [...ctx.db.role.iter()];
      const hasAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (authenticatedUsers.length === 1 && !hasAdminRole) {
        try {
          const adminRole = ctx.db.role.insert({
            id: 0n,
            channelId: undefined,
            name: 'Admin',
            color: '#f04747',
            permissions: Permissions.ADMIN,
            position: 1000n,
            createdAt: ctx.timestamp,
            createdBy: ctx.sender,
          });
          
          ctx.db.roleMember.insert({
            id: 0n,
            roleId: adminRole.id,
            userId: ctx.sender,
            assignedAt: ctx.timestamp,
            assignedBy: undefined,
          });
          
          console.info(`First authenticated user ${ctx.sender} automatically assigned admin role`);
        } catch (err) {
          console.error('Error creating admin role:', err);
        }
      }
    }
    
    // Create Google auth record
    ctx.db.googleAuth.insert({
      googleId: googleId.trim(),
      identity: ctx.sender,
      email: email?.toLowerCase().trim() || undefined,
      name: name?.trim() || undefined,
      avatar: avatar || undefined,
      createdAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} signed up with Google ID ${googleId}`);
  }
);

export const login_google = spacetimedb.reducer(
  { googleId: t.string() },
  (ctx, { googleId }) => {
    if (!googleId || googleId.trim().length === 0) {
      throw new SenderError('Google ID is required');
    }
    
    // Find Google auth record
    const googleAuth = ctx.db.googleAuth.googleId.find(googleId.trim());
    if (!googleAuth) {
      throw new SenderError('Google account not found. Please sign up first.');
    }
    
    // Ensure user record exists
    let user = ctx.db.user.identity.find(googleAuth.identity);
    if (!user) {
      user = ctx.db.user.insert({
        identity: googleAuth.identity,
        name: googleAuth.name || undefined,
        online: true,
        avatar: googleAuth.avatar || undefined,
        authMethod: 'google',
        lastIpAddress: undefined, // Will be set on next connection
      });
    } else {
      // Update user info from Google auth if available
      ctx.db.user.identity.update({
        ...user,
        online: true,
        name: googleAuth.name || user.name,
        avatar: googleAuth.avatar || user.avatar,
        authMethod: 'google',
      });
    }
    
    console.info(`User ${googleAuth.identity} logged in with Google ID ${googleId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// VOICE ROOM REDUCERS
// ─────────────────────────────────────────────────────────────────────────────

export const join_voice = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const channel = ctx.db.channel.id.find(channelId);
    if (!channel) {
      throw new SenderError('Channel not found');
    }
    
    // Check if user is a channel member
    const channelMembers = [...ctx.db.channelMember.iter()].filter(m => m.channelId === channelId);
    const member = channelMembers.find(m => m.userId.isEqual(ctx.sender));
    if (!member) {
      throw new SenderError('You must be a member of the channel to join voice');
    }
    
    // Find or create voice room for this channel
    const existingRooms = [...ctx.db.voiceRoom.iter()].filter(r => r.channelId === channelId);
    let room = existingRooms[0];
    
    if (!room) {
      room = ctx.db.voiceRoom.insert({
        id: 0n,
        channelId,
        createdAt: ctx.timestamp,
      });
    }
    
    // Check if user is already in the voice room
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    const existingParticipant = participants.find(p => p.userId.isEqual(ctx.sender));
    
    if (existingParticipant) {
      throw new SenderError('You are already in the voice room');
    }
    
    // Add user to voice room
    ctx.db.voiceParticipant.insert({
      id: 0n,
      roomId: room.id,
      userId: ctx.sender,
      muted: false,
      deafened: false,
      joinedAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} joined voice room for channel ${channelId}`);
  }
);

export const leave_voice = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const rooms = [...ctx.db.voiceRoom.iter()].filter(r => r.channelId === channelId);
    if (rooms.length === 0) {
      // Room may have been deleted by onDisconnect when client disconnected
      return;
    }
    
    const room = rooms[0];
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    const participant = participants.find(p => p.userId.isEqual(ctx.sender));
    
    if (!participant) {
      // Already left (e.g. removed by onDisconnect) - no-op
      return;
    }
    
    ctx.db.voiceParticipant.delete(participant);
    
    // Clean up signaling messages for this user
    const signals = [...ctx.db.voiceSignaling.iter()].filter(
      s => s.roomId === room.id && 
      (s.fromUserId.isEqual(ctx.sender) || s.toUserId.isEqual(ctx.sender))
    );
    signals.forEach(signal => ctx.db.voiceSignaling.delete(signal));
    
    // If room is empty, delete it
    const remainingParticipants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    if (remainingParticipants.length === 0) {
      ctx.db.voiceRoom.delete(room);
    }
    
    console.info(`User ${ctx.sender} left voice room for channel ${channelId}`);
  }
);

export const toggle_voice_mute = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const rooms = [...ctx.db.voiceRoom.iter()].filter(r => r.channelId === channelId);
    if (rooms.length === 0) {
      throw new SenderError('Voice room not found');
    }
    
    const room = rooms[0];
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    const participant = participants.find(p => p.userId.isEqual(ctx.sender));
    
    if (!participant) {
      throw new SenderError('You are not in the voice room');
    }
    
    ctx.db.voiceParticipant.id.update({
      ...participant,
      muted: !participant.muted,
    });
    
    console.info(`User ${ctx.sender} ${participant.muted ? 'unmuted' : 'muted'} in voice room`);
  }
);

export const toggle_voice_deafen = spacetimedb.reducer(
  { channelId: t.u64() },
  (ctx, { channelId }) => {
    const rooms = [...ctx.db.voiceRoom.iter()].filter(r => r.channelId === channelId);
    if (rooms.length === 0) {
      throw new SenderError('Voice room not found');
    }
    
    const room = rooms[0];
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    const participant = participants.find(p => p.userId.isEqual(ctx.sender));
    
    if (!participant) {
      throw new SenderError('You are not in the voice room');
    }
    
    ctx.db.voiceParticipant.id.update({
      ...participant,
      deafened: !participant.deafened,
      muted: !participant.deafened ? true : participant.muted, // Auto-mute when deafened
    });
    
    console.info(`User ${ctx.sender} ${participant.deafened ? 'undeafened' : 'deafened'} in voice room`);
  }
);

export const send_voice_signal = spacetimedb.reducer(
  { 
    channelId: t.u64(),
    toUserId: t.identity(),
    signalType: t.string(),
    signalData: t.string()
  },
  (ctx, { channelId, toUserId, signalType, signalData }) => {
    const rooms = [...ctx.db.voiceRoom.iter()].filter(r => r.channelId === channelId);
    if (rooms.length === 0) {
      throw new SenderError('Voice room not found');
    }
    
    const room = rooms[0];
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
    const senderParticipant = participants.find(p => p.userId.isEqual(ctx.sender));
    const receiverParticipant = participants.find(p => p.userId.isEqual(toUserId));
    
    if (!senderParticipant) {
      throw new SenderError('You are not in the voice room');
    }
    
    if (!receiverParticipant) {
      throw new SenderError('Target user is not in the voice room');
    }
    
    if (!['offer', 'answer', 'ice-candidate'].includes(signalType)) {
      throw new SenderError('Invalid signal type');
    }
    
    // Store signaling message
    ctx.db.voiceSignaling.insert({
      id: 0n,
      roomId: room.id,
      fromUserId: ctx.sender,
      toUserId,
      signalType,
      signalData,
      createdAt: ctx.timestamp,
    });
    
    console.info(`User ${ctx.sender} sent ${signalType} signal to ${toUserId} in voice room`);
  }
);

export const save_voice_chunk = spacetimedb.reducer(
  { roomId: t.u64(), channelId: t.u64(), chunkIndex: t.u64(), dataBase64: t.string() },
  (ctx, { roomId, channelId, chunkIndex, dataBase64 }) => {
    if (!dataBase64 || dataBase64.length > 50000) {
      throw new SenderError('Invalid chunk data (max 50KB base64)');
    }
    const rooms = [...ctx.db.voiceRoom.iter()].filter(r => r.id === roomId);
    if (rooms.length === 0) {
      throw new SenderError('Voice room not found');
    }
    const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === roomId);
    const senderParticipant = participants.find(p => p.userId.isEqual(ctx.sender));
    if (!senderParticipant) {
      throw new SenderError('You are not in the voice room');
    }
    ctx.db.voiceRecordingChunk.insert({
      id: 0n,
      roomId,
      channelId,
      chunkIndex,
      dataBase64,
      recordedBy: ctx.sender,
      createdAt: ctx.timestamp,
    });
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// ROLE MANAGEMENT REDUCERS
// ─────────────────────────────────────────────────────────────────────────────

export const create_role = spacetimedb.reducer(
  { 
    channelId: t.u64().optional(),
    name: t.string(),
    color: t.string().optional(),
    permissions: t.u64(),
    position: t.u64().optional()
  },
  (ctx, { channelId, name, color, permissions, position }) => {
    if (!name || name.trim().length === 0) {
      throw new SenderError('Role name cannot be empty');
    }
    if (name.length > 32) {
      throw new SenderError('Role name must be 32 characters or less');
    }
    
    // Check permissions
    if (channelId) {
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, channelId);
      if (!checkPermission(userPerms, Permissions.MANAGE_ROLES)) {
        throw new SenderError('You do not have permission to manage roles');
      }
      
      // Verify channel exists
      const channel = ctx.db.channel.id.find(channelId);
      if (!channel) {
        throw new SenderError('Channel not found');
      }
    } else {
      // Global role - check if any admin exists
      const allRoles = [...ctx.db.role.iter()];
      const hasAnyAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (hasAnyAdminRole) {
        // If admin role exists, check if user is admin
        const userRoles = [...ctx.db.roleMember.iter()].filter(rm => rm.userId.isEqual(ctx.sender));
        const hasAdminRole = userRoles.some(rm => {
          const role = ctx.db.role.id.find(rm.roleId);
          return role && (role.permissions & Permissions.ADMIN) !== 0n;
        });
        
        if (!hasAdminRole) {
          throw new SenderError('Only admins can create global roles');
        }
      }
      // If no admin role exists, allow creation (first user scenario)
    }
    
    // Prevent creating roles with all permissions without ADMIN flag
    const allNonAdminPerms = Object.values(Permissions)
      .filter(p => p !== Permissions.ADMIN)
      .reduce((acc, p) => acc | p, 0n);
    
    const hasAllNonAdminPerms = (permissions & allNonAdminPerms) === allNonAdminPerms;
    const hasAdminPerm = (permissions & Permissions.ADMIN) !== 0n;
    
    if (hasAllNonAdminPerms && !hasAdminPerm) {
      throw new SenderError('Tüm izinleri vermek için Admin izni gereklidir');
    }
    
    // Get max position for this channel/global
    const existingRoles = [...ctx.db.role.iter()].filter(
      r => channelId ? r.channelId === channelId : !r.channelId
    );
    const maxPosition = existingRoles.length > 0
      ? existingRoles.reduce((max, r) => r.position > max ? r.position : max, 0n)
      : 0n;
    
    const role = ctx.db.role.insert({
      id: 0n,
      channelId: channelId ?? undefined,
      name: name.trim(),
      color: color?.trim() || undefined,
      permissions,
      position: position ?? (maxPosition + 1n),
      createdAt: ctx.timestamp,
      createdBy: ctx.sender,
    });
    
    console.info(`User ${ctx.sender} created role ${name} for ${channelId ? `channel ${channelId}` : 'global'}`);
  }
);

export const assign_role = spacetimedb.reducer(
  { roleId: t.u64(), userId: t.identity() },
  (ctx, { roleId, userId }) => {
    const role = ctx.db.role.id.find(roleId);
    if (!role) {
      throw new SenderError('Role not found');
    }
    
    // Check permissions
    if (role.channelId) {
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, role.channelId);
      if (!checkPermission(userPerms, Permissions.ASSIGN_ROLES)) {
        throw new SenderError('You do not have permission to assign roles');
      }
    } else {
      // Global role - check if any admin exists
      const allRoles = [...ctx.db.role.iter()];
      const hasAnyAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (hasAnyAdminRole) {
        // If admin role exists, check if user is admin
        const userRoles = [...ctx.db.roleMember.iter()].filter(rm => rm.userId.isEqual(ctx.sender));
        const hasAdminRole = userRoles.some(rm => {
          const r = ctx.db.role.id.find(rm.roleId);
          return r && (r.permissions & Permissions.ADMIN) !== 0n;
        });
        
        if (!hasAdminRole) {
          throw new SenderError('Only admins can assign global roles');
        }
      }
      // If no admin role exists, allow assignment (first user scenario)
    }
    
    // Check if already assigned
    const existing = [...ctx.db.roleMember.iter()].find(
      rm => rm.roleId === roleId && rm.userId.isEqual(userId)
    );
    
    if (existing) {
      throw new SenderError('Role already assigned to user');
    }
    
    ctx.db.roleMember.insert({
      id: 0n,
      roleId,
      userId,
      assignedAt: ctx.timestamp,
      assignedBy: ctx.sender,
    });
    
    console.info(`User ${ctx.sender} assigned role ${roleId} to ${userId}`);
  }
);

export const remove_role = spacetimedb.reducer(
  { roleId: t.u64(), userId: t.identity() },
  (ctx, { roleId, userId }) => {
    const role = ctx.db.role.id.find(roleId);
    if (!role) {
      throw new SenderError('Role not found');
    }
    
    // Prevent removing admin roles
    if ((role.permissions & Permissions.ADMIN) !== 0n) {
      // Prevent admin from removing their own admin role
      if (userId.isEqual(ctx.sender)) {
        throw new SenderError('Kendi adminliğinizi kaldıramazsınız. Başka bir admin bu işlemi yapmalıdır.');
      }
      
      // Prevent removing admin role from other users - no one can remove admin roles
      // This ensures system always has admins
      throw new SenderError('Admin rolü kaldırılamaz. Sistemde en az bir admin olmalıdır.');
    }
    
    // Check permissions
    if (role.channelId) {
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, role.channelId);
      if (!checkPermission(userPerms, Permissions.ASSIGN_ROLES)) {
        throw new SenderError('You do not have permission to remove roles');
      }
    } else {
      // Global role - check if any admin exists
      const allRoles = [...ctx.db.role.iter()];
      const hasAnyAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (hasAnyAdminRole) {
        // If admin role exists, check if user is admin
        const userRoles = [...ctx.db.roleMember.iter()].filter(rm => rm.userId.isEqual(ctx.sender));
        const hasAdminRole = userRoles.some(rm => {
          const r = ctx.db.role.id.find(rm.roleId);
          return r && (r.permissions & Permissions.ADMIN) !== 0n;
        });
        
        if (!hasAdminRole) {
          throw new SenderError('Only admins can remove global roles');
        }
      }
      // If no admin role exists, allow removal (first user scenario)
    }
    
    const roleMember = [...ctx.db.roleMember.iter()].find(
      rm => rm.roleId === roleId && rm.userId.isEqual(userId)
    );
    
    if (!roleMember) {
      throw new SenderError('Role not assigned to user');
    }
    
    ctx.db.roleMember.delete(roleMember);
    
    console.info(`User ${ctx.sender} removed role ${roleId} from ${userId}`);
  }
);

export const delete_role = spacetimedb.reducer(
  { roleId: t.u64() },
  (ctx, { roleId }) => {
    const role = ctx.db.role.id.find(roleId);
    if (!role) {
      throw new SenderError('Role not found');
    }
    
    // Prevent admin from deleting admin roles
    if ((role.permissions & Permissions.ADMIN) !== 0n) {
      // Get all users assigned to this admin role
      const roleMembers = [...ctx.db.roleMember.iter()].filter(
        rm => rm.roleId === roleId
      );
      
      // Check if the user trying to delete is assigned to this admin role
      const userRoleMembers = roleMembers.filter(
        rm => rm.userId.isEqual(ctx.sender)
      );
      
      if (userRoleMembers.length > 0) {
        // Admin cannot delete their own admin role
        throw new SenderError('Kendi adminliğinizi silemezsiniz. Başka bir admin bu işlemi yapmalıdır.');
      }
      
      // Prevent deleting admin roles that belong to other users
      // Only allow deletion if the role has no members (orphaned role)
      if (roleMembers.length > 0) {
        throw new SenderError('Başka bir kullanıcının admin rolünü silemezsiniz.');
      }
      
      // Additional check: Ensure system always has at least one admin
      const allAdminRoles = [...ctx.db.role.iter()].filter(
        r => (r.permissions & Permissions.ADMIN) !== 0n && r.id !== roleId
      );
      
      if (allAdminRoles.length > 0) {
        // Get all users with admin roles (excluding the role being deleted)
        const allAdminRoleMembers = [...ctx.db.roleMember.iter()].filter(rm => {
          const r = ctx.db.role.id.find(rm.roleId);
          return r && r.id !== roleId && (r.permissions & Permissions.ADMIN) !== 0n;
        });
        
        // Get unique admin users
        const adminUsers = new Set<string>();
        allAdminRoleMembers.forEach(rm => {
          adminUsers.add(rm.userId.toHexString());
        });
        
        // If deleting this role would leave the system without admins, prevent it
        if (adminUsers.size === 0) {
          throw new SenderError('Sistemde en az bir admin olmalıdır. Bu rolü silmek tüm adminleri kaldırır.');
        }
      }
    }
    
    // Check permissions
    if (role.channelId) {
      const userPerms = getUserChannelPermissions(ctx, ctx.sender, role.channelId);
      if (!checkPermission(userPerms, Permissions.MANAGE_ROLES)) {
        throw new SenderError('You do not have permission to delete roles');
      }
    } else {
      // Global role - check if any admin exists
      const allRoles = [...ctx.db.role.iter()];
      const hasAnyAdminRole = allRoles.some(r => (r.permissions & Permissions.ADMIN) !== 0n);
      
      if (hasAnyAdminRole) {
        // If admin role exists, check if user is admin
        const userRoles = [...ctx.db.roleMember.iter()].filter(rm => rm.userId.isEqual(ctx.sender));
        const hasAdminRole = userRoles.some(rm => {
          const r = ctx.db.role.id.find(rm.roleId);
          return r && (r.permissions & Permissions.ADMIN) !== 0n;
        });
        
        if (!hasAdminRole) {
          throw new SenderError('Only admins can delete global roles');
        }
      }
      // If no admin role exists, allow deletion (first user scenario)
    }
    
    // Remove all role memberships
    const roleMembers = [...ctx.db.roleMember.iter()].filter(rm => rm.roleId === roleId);
    roleMembers.forEach(rm => ctx.db.roleMember.delete(rm));
    
    // Delete role
    ctx.db.role.delete(role);
    
    console.info(`User ${ctx.sender} deleted role ${roleId}`);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION & CONNECTION HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

export const init = spacetimedb.init(ctx => {
  console.info('Module initialized');
  
  // Note: Admin role will be created on-demand when needed
  // Creating it in init can cause issues if the table is not ready
  // Roles can be created manually through the UI
});

export const onConnect = spacetimedb.clientConnected(ctx => {
  // Try to get connection address from context
  // SpacetimeDB provides ctx.address which is a unique identifier for the connection
  // Note: This is not the actual IP address, but a connection identifier
  // For actual IP, we would need to use a custom reducer that receives IP from client
  let connectionAddress: string | undefined = undefined;
  
  // @ts-ignore - address may be available in context
  if (ctx.address) {
    // @ts-ignore
    connectionAddress = String(ctx.address);
  }
  
  // Check if user already exists
  const user = ctx.db.user.identity.find(ctx.sender);
  
  if (user) {
    // User exists - just update online status and IP
    ctx.db.user.identity.update({ 
      ...user, 
      online: true,
      lastIpAddress: connectionAddress || user.lastIpAddress, // Update connection address if available
    });
  } else {
    // Check if this identity has any auth credentials (email or Google)
    const emailCreds = [...ctx.db.emailCredential.iter()].find(c => c.identity.isEqual(ctx.sender));
    const googleAuths = [...ctx.db.googleAuth.iter()].find(a => a.identity.isEqual(ctx.sender));
    
    if (emailCreds || googleAuths) {
      // Identity has auth credentials but no user record - create user record
      // This can happen if user was created before user table existed, or data was cleared
      const authMethod = emailCreds ? 'email' : 'google';
      
      ctx.db.user.insert({
        identity: ctx.sender,
        name: undefined, // Will be set during login/signup
        online: true,
        avatar: undefined,
        authMethod: authMethod,
        lastIpAddress: connectionAddress,
      });
      
      console.info(`User ${ctx.sender} reconnected with existing auth credentials`);
    }
    // If no auth credentials exist, don't create anonymous user
    // User will be created during signup/login process
    // This prevents duplicate users when page refreshes with a new Identity
  }
});

export const onDisconnect = spacetimedb.clientDisconnected(ctx => {
  const user = ctx.db.user.identity.find(ctx.sender);
  if (user) {
    ctx.db.user.identity.update({ ...user, online: false });
  } else {
    console.warn(
      `Disconnect event for unknown user with identity ${ctx.sender}`
    );
  }
  
  // Clean up voice room participation
  const participants = [...ctx.db.voiceParticipant.iter()].filter(p => p.userId.isEqual(ctx.sender));
  participants.forEach(participant => {
    const room = ctx.db.voiceRoom.id.find(participant.roomId);
    if (room) {
      ctx.db.voiceParticipant.delete(participant);
      
      // Clean up signaling messages
      const signals = [...ctx.db.voiceSignaling.iter()].filter(
        s => s.roomId === room.id && 
        (s.fromUserId.isEqual(ctx.sender) || s.toUserId.isEqual(ctx.sender))
      );
      signals.forEach(signal => ctx.db.voiceSignaling.delete(signal));
      
      // Delete room if empty
      const remainingParticipants = [...ctx.db.voiceParticipant.iter()].filter(p => p.roomId === room.id);
      if (remainingParticipants.length === 0) {
        ctx.db.voiceRoom.delete(room);
      }
    }
  });
});
