# 🎵 Spotify Player Clone - React Native/Expo

Full-featured Spotify player implementation for React Native using Expo, featuring complete playback control, queue management, and seamless integration with Spotify Web API.

## 📦 Download APK

**[📲 Download Latest APK](https://github.com/jesusneresberg-ux/spotify-player-rn/releases)** | **[📖 Installation Guide](docs/APK_DOWNLOAD.md)**

The APK is automatically built via GitHub Actions on every release. See the [APK_DOWNLOAD.md](docs/APK_DOWNLOAD.md) guide for installation instructions and troubleshooting.

## ✨ Features

### 🎮 Player Controls
- ▶️ Play/Pause
- ⏭️ Skip Next/Previous with smart logic
- 📍 Seek to any position
- 🔊 Volume control (0-100%)
- ⏱️ Real-time progress tracking
- 📊 Time display (elapsed/duration)

### 🔄 Playback Modes
- 🔀 **Shuffle** - Random playback order (Fisher-Yates algorithm)
- 🔁 **Repeat** - Off → All → One → Off
- 🎛️ **Crossfade** - Smooth transitions between tracks (extensible)
- 📈 **Normalization** - Equal loudness (infrastructure ready)

### 📋 Queue Management
- Track queue with unlimited capacity
- Add/remove tracks dynamically
- Reorganize queue order
- Previous track history tracking
- Clear entire queue
- Queue preview display

### 🔐 Authentication
- OAuth 2.0 with PKCE (Proof Key for Code Exchange)
- Secure token storage with Expo SecureStore
- Automatic token refresh
- Session restoration

### 🌐 Data Sources
- **Spotify API** - Full catalog access with authentication
- **Local Files** - Playback of device audio files
- **Hybrid** - Mix of both sources

### 🎨 UI Components
- `NowPlayingCard` - Album artwork with metadata
- `PlayerControls` - Play/pause/skip buttons
- `ProgressBar` - Interactive seek bar
- `ModeButtons` - Shuffle/repeat controls
- `PlayerScreen` - Full-screen player
- Queue preview

### 💾 State Management
- Zustand stores for global state
- AsyncStorage for persistence
- Automatic state hydration

---

## 🏗️ Architecture

### Core Layers

```
┌─────────────────────────────────────┐
│      React Native Components        │
├─────────────────────────────────────┤
│   Zustand Stores (playerStore,      │
│   authStore, searchStore)           │
├─────────────────────────────────────┤
│   PlayerController (Orchestration)  │
├─────────────────────────────────────┤
│   Audio Abstraction Layer           │
│   ├── SpotifyPlayer (API remote)   │
│   └── LocalPlayer (expo-av)        │
├─────────────────────────────────────┤
│   Core Services                     │
│   ├── SpotifyAuth (OAuth)          │
│   ├── TokenManager                 │
│   └── QueueManager                 │
└─────────────────────────────────────┘
```

### Class Hierarchy

```
AudioPlayer (abstract)
├── SpotifyPlayer
│   ├── Polls Spotify API for playback state
│   ├── Controls Spotify app (remote)
│   ├── Syncs with devices
│   └── Handles auth errors
│
└── LocalPlayer
    ├── Uses Expo AV for local files
    ├── Handles file playback
    ├── Progress tracking
    └── Event management
```

### Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Zustand Store (playerStore)
    ↓
PlayerController
    ↓
Audio Player (Spotify/Local)
    ↓
API/Expo AV
    ↓
Update State → Rerender
```

---

## 📁 Project Structure

```
spotify-player-rn/
│
├── app/                          # Expo Router navigation
│   ├── (auth)/                   # Auth screens
│   ├── (tabs)/                   # Tab navigation
│   └── _layout.tsx
│
├── src/
│   ├── core/
│   │   ├── audio/               # Audio engine
│   │   │   ├── types.ts
│   │   │   ├── AudioPlayer.ts   # Base class
│   │   │   ├── SpotifyPlayer.ts
│   │   │   ├── LocalPlayer.ts
│   │   │   └── PlayerController.ts
│   │   │
│   │   └── auth/
│   │       └── SpotifyAuth.ts   # OAuth PKCE
│   │
│   ├── stores/                  # Zustand stores
│   │   ├── playerStore.ts
│   │   ├── authStore.ts
│   │   └── searchStore.ts
│   │
│   ├── ui/
│   │   ├── components/          # Reusable components
│   │   ├── screens/             # Full screens
│   │   └── theme.ts
│   │
│   ├── hooks/                   # Custom hooks
│   │
│   ├── services/                # Helpers & services
│   │
│   ├── utils/
│   │   ├── formatters.ts        # String formatting
│   │   └── constants.ts         # App-wide constants
│   │
│   └── types/                   # TypeScript definitions
│
├── assets/                       # Images, icons, fonts
│
├── __tests__/                    # Jest test files
│
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
node --version  # 18+
npm install -g expo-cli
```

### 2. Setup Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Create an app, copy Client ID
3. Add Redirect URI: `exp://localhost:19000/--/spotify-callback`

### 3. Install & Configure

```bash
# Clone or create
git clone <repo>
cd spotify-player-rn

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your Client ID
```

### 4. Run

```bash
# iOS (macOS)
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 💻 Core Usage

### Initialize Player

```typescript
import { usePlayerStore } from '@/stores/playerStore';
import { useAuthStore } from '@/stores/authStore';
import { PlayerType } from '@/core/audio/types';

const { initPlayer } = usePlayerStore();
const { accessToken, refreshToken } = useAuthStore();

// Initialize Spotify player
await initPlayer({
  type: PlayerType.SPOTIFY,
  accessToken,
  spotifyRefreshToken: refreshToken,
});
```

### Play a Track

```typescript
import { Track } from '@/core/audio/types';

const { playTrack } = usePlayerStore();

const track: Track = {
  id: '123',
  title: 'Song Name',
  artist: 'Artist Name',
  album: 'Album Name',
  duration: 180000,
  uri: 'spotify:track:abc123',
  isLocal: false,
};

await playTrack(track);
```

### Handle Queue

```typescript
const { 
  queue, 
  currentIndex, 
  addToQueue,
  removeFromQueue,
  moveQueueItem 
} = usePlayerStore();

// Add tracks
addToQueue(track);
addToQueue([track1, track2]);

// Manage
removeFromQueue(2);
moveQueueItem(0, 3);
```

---

## 🔌 API Integration

### Spotify Web API

The `SpotifyPlayer` class wraps API calls:

```typescript
// Play
PUT /v1/me/player/play
Body: { uris: ["spotify:track:..."] }

// Controls
PUT /v1/me/player/pause
POST /v1/me/player/next
POST /v1/me/player/previous
PUT /v1/me/player/seek?position_ms=60000

// State
GET /v1/me/player
```

### Error Handling

```typescript
// Automatic retry on network errors
// Token refresh on 401
// User-friendly error messages

const { playback } = usePlayerStore();

if (playback.state === PlaybackState.ERROR) {
  console.error(playback.error);
  // Show error UI
}
```

---

## 🎨 Customization

### Colors

Edit `src/utils/constants.ts`:

```typescript
export const COLORS = {
  PRIMARY: '#1DB954',      // Spotify green
  BACKGROUND: '#121212',
  SURFACE: '#191414',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#B3B3B3',
  ERROR: '#FF6B6B',
};
```

### Fonts

Add fonts to `assets/fonts/` and configure in `app.json`:

```json
{
  "expo": {
    "plugins": [
      ["expo-font", {
        "fonts": ["./assets/fonts/SpotifyBold.ttf"]
      }]
    ]
  }
}
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

Example test:

```typescript
import { PlayerController } from '@/core/audio/PlayerController';

describe('PlayerController', () => {
  it('should play next track', async () => {
    const controller = new PlayerController();
    // ... test implementation
  });
});
```

---

## 📱 Device Compatibility

### iOS
- iOS 14+
- Requires Spotify app for premium features
- Uses AVFoundation for local audio

### Android
- Android 9+
- Requires Spotify app
- Uses MediaPlayer for local audio

### Web
- Chrome/Firefox/Safari
- Expo preview only

---

## ⚡ Performance Optimization

- **Code Splitting**: Lazy load screens with Expo Router
- **State Optimization**: Only subscribe to needed store slices
- **Image Caching**: AsyncStorage + local disk cache
- **Debounced Seek**: Prevent excessive API calls
- **Polling Optimization**: Adaptive refresh intervals

---

## 🐛 Troubleshooting

### "No active Spotify device found"
- Open Spotify app on device
- Play something first
- Return to app

### Token expires
- Implemented automatically
- Check `useAuthStore` for token state

### Playback won't start
1. Check Spotify Premium
2. Verify internet connection
3. Restart Spotify app
4. Check console logs

### Build issues
```bash
npm install
npm run lint
npm run type-check
```

---

## 🔐 Security

- **PKCE for OAuth**: Secure flow without client secret
- **SecureStore for tokens**: Encrypted token storage
- **Token validation**: Check expiration before API calls
- **No hardcoded secrets**: Use environment variables

---

## 🚢 Deployment

### EAS Build

```bash
# Create eas.json
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 📈 Roadmap

- [ ] Lyrics synchronization
- [ ] Social features (share playlists)
- [ ] Offline mode
- [ ] Audio visualizer
- [ ] Multi-device sync
- [ ] Dark/light theme toggle
- [ ] Equalizer
- [ ] Smart recommendations

---

## 📚 Documentation

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Zustand](https://zustand-demo.vercel.app)
- [TypeScript](https://www.typescriptlang.org)

---

## 📄 License

MIT License - See LICENSE file

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 Author

Built as a reverse-engineering learning project for Spotify's player architecture.

---

## ❓ FAQ

**Q: Do I need Spotify Premium?**
A: Yes, to stream music via API. Free users can use local files.

**Q: Can I use this commercially?**
A: Read Spotify's terms. This is for learning/personal use.

**Q: How often is it updated?**
A: Regularly, following Spotify API changes.

**Q: Where do I report bugs?**
A: GitHub Issues

---

**Made with ❤️ and ☕**

