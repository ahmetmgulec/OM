# OM – Discord-like Chat

A real-time Discord-like chat application built with SpacetimeDB and React.

## Features

- 🚀 **Real-time messaging** with SpacetimeDB
- 💬 **Channels and threads** support
- 👥 **User presence** (online/offline)
- 🎨 **Discord-like dark theme** UI
- ✏️ **Edit messages**
- 📝 **Create channels**
- 🔐 **Email/password** authentication
- 🔵 **Google OAuth** authentication
- 👑 **Role-based permissions** system
- 🎤 **Voice chat** with WebRTC (STUN + TURN)
- 🌐 **Multi-language** (Turkish / English)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SpacetimeDB CLI (`npm install -g spacetime`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate SpacetimeDB module bindings:
   ```bash
   npm run spacetime:generate
   ```

3. Publish the module to SpacetimeDB:
   ```bash
   npm run spacetime:publish
   ```
   Uses `--clear-database -y` for clean deploys.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173` (or the port shown in terminal)

### Production

- **HTTPS required** for voice chat (WebRTC needs secure context)
- Set `VITE_SPACETIMEDB_HOST` to your SpacetimeDB WebSocket URL (e.g. `wss://...`)

## Project Structure

```
OM/
├── spacetimedb/              # SpacetimeDB module (backend)
│   └── src/
│       └── index.ts          # Schema, reducers, handlers
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── UserList.tsx
│   │   ├── VoiceControls.tsx
│   │   ├── CreateChannelModal.tsx
│   │   ├── AddUserToChannelModal.tsx
│   │   ├── RoleManagementModal.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── NotificationBar.tsx
│   │   └── LanguageSelector.tsx
│   ├── hooks/
│   │   └── useVoiceChat.ts   # WebRTC voice chat
│   ├── contexts/
│   │   └── LanguageContext.tsx
│   ├── module_bindings/      # Generated SpacetimeDB bindings
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Available Scripts

| Command                      | Description                              |
|-----------------------------|------------------------------------------|
| `npm run dev`               | Start development server                 |
| `npm run build`             | Build for production                     |
| `npm run preview`           | Preview production build                |
| `npm run spacetime:generate`| Generate TypeScript bindings from schema|
| `npm run spacetime:publish` | Publish module to SpacetimeDB maincloud  |
| `npm run spacetime:publish:local` | Publish to local SpacetimeDB server |

## Configuration

Environment variables (e.g. `.env.local`):

| Variable                  | Description                        | Default          |
|---------------------------|------------------------------------|------------------|
| `VITE_SPACETIMEDB_HOST`   | SpacetimeDB WebSocket URL          | `ws://localhost:3000` |
| `VITE_SPACETIMEDB_DB_NAME`| Database name                      | `mytestapp`       |
| `VITE_GOOGLE_CLIENT_ID`   | Google OAuth Client ID             | (required for Google sign-in) |
| `VITE_VOICE_DEBUG`        | Enable voice chat debug logs       | `false`          |

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → Create project
2. APIs & Services → Credentials → Create OAuth client ID
3. Application type: Web application
4. Authorized JavaScript origins: e.g. `http://localhost:5173`, your production URL
5. Add to `.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id
   ```

### Voice Debug

- URL: add `?voice_debug` to enable logs
- Or run in console: `localStorage.setItem('voice_debug', '1')` then refresh

## Role & Permission System

- **Channel roles** – Per-channel permissions
- **Global roles** – System-wide roles
- **Permission bitmask** – Create/delete channels, send/edit/delete messages, kick/ban users, manage roles, join/speak in voice, mute others
- **Admin** – Full permissions; only admins can play back voice recordings

## Voice Chat

- WebRTC with STUN (Google, freeTURN) and TURN (freeTURN)
- **Auto-recording** – When someone is in a voice room, the designated recorder saves chunks to the DB
- **Playback** – Admins see “Ses Kayıtları” and can listen to recordings
- High-quality audio (48 kHz, Opus 64 kbps for recording)

## License

MIT
