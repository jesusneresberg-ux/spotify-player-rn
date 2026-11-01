# 📚 Documentação Spotify Web API

## 🔐 Autenticação

### OAuth 2.0 Flow
A API do Spotify usa OAuth 2.0 para autenticação. Para React Native, o mais recomendado é:

**Authorization Code Flow with PKCE** (Proof Key for Code Exchange)
- Mais seguro para apps mobile
- Não requer client secret
- Suporta refresh tokens

```typescript
// Fluxo simplificado
1. Gerar code_verifier (random string)
2. Gerar code_challenge = SHA256(code_verifier)
3. Redirecionar usuário para authorize URL
4. Trocar authorization code por access token
5. Usar refresh token para renovar
```

### Escopos Necessários
```typescript
const SCOPES = [
  'user-read-playback-state',     // Estado do player
  'user-modify-playback-state',   // Controlar playback
  'user-read-currently-playing',  // Track atual
  'streaming',                    // Web Playback SDK
  'user-library-read',            // Biblioteca do usuário
  'user-library-modify',          // Modificar biblioteca
  'playlist-read-private',        // Playlists privadas
  'playlist-modify-public',       // Modificar playlists públicas
  'playlist-modify-private',      // Modificar playlists privadas
];
```

---

## 🎵 Endpoints Principais

### 1. Player Control
```
GET  /v1/me/player              # Estado atual do player
PUT  /v1/me/player/play         # Play/Resume
PUT  /v1/me/player/pause        # Pause
POST /v1/me/player/next         # Próxima track
POST /v1/me/player/previous     # Track anterior
PUT  /v1/me/player/seek         # Seek para posição (ms)
PUT  /v1/me/player/volume       # Ajustar volume (0-100)
PUT  /v1/me/player/shuffle      # Toggle shuffle
PUT  /v1/me/player/repeat       # Set repeat mode (off/track/context)
```

### 2. Playback State
```typescript
// GET /v1/me/player
{
  "device": {
    "id": "...",
    "name": "My Phone",
    "type": "Smartphone",
    "volume_percent": 80
  },
  "shuffle_state": false,
  "repeat_state": "off", // "off" | "track" | "context"
  "timestamp": 1234567890,
  "progress_ms": 45000,
  "is_playing": true,
  "item": {
    "id": "track_id",
    "name": "Track Name",
    "artists": [...],
    "album": {...},
    "duration_ms": 240000,
    "uri": "spotify:track:..."
  }
}
```

### 3. Queue Management
```
GET  /v1/me/player/queue        # Ver fila atual
POST /v1/me/player/queue        # Adicionar à fila
```

### 4. Search & Browse
```
GET /v1/search                  # Buscar tracks/albums/artists
GET /v1/browse/featured-playlists
GET /v1/browse/new-releases
GET /v1/recommendations
```

### 5. Library
```
GET  /v1/me/tracks              # Músicas salvas
PUT  /v1/me/tracks              # Salvar track
DELETE /v1/me/tracks            # Remover track
GET  /v1/me/playlists           # Playlists do usuário
```

---

## ⚠️ Limitações e Rate Limits

### Rate Limits
- **429 Too Many Requests** quando exceder limites
- Header `Retry-After` indica quando tentar novamente
- Recomendado: implementar exponential backoff

### Limites por Endpoint
- **Player controls**: ~180 requests/minuto
- **Search**: ~180 requests/minuto
- **Get tracks**: ~180 requests/minuto

### Restrições do Web Playback SDK
⚠️ **IMPORTANTE**: O Web Playback SDK oficial **NÃO funciona em React Native**
- Requer navegador web (DOM)
- Usa Web Audio API
- React Native não tem essas APIs

**Alternativas para React Native:**
1. **Usar API de controle remoto**: Controlar dispositivos Spotify ativos (app oficial)
2. **Preview URLs**: Usar URLs de preview (30s) para demonstração
3. **Áudio local**: Para tracks próprios, usar expo-av ou react-native-track-player

---

## 🔌 Integração React Native

### Biblioteca Recomendada
```bash
npm install react-native-spotify-remote
```

Esta lib permite:
- Controlar app Spotify instalado no device
- Receber updates de playback state
- Funciona como "remote control"

### Fluxo Híbrido (Melhor Abordagem)
```typescript
// Para tracks do Spotify: usar remote control
SpotifyRemote.playUri('spotify:track:...');

// Para áudio local: usar player próprio
import TrackPlayer from 'react-native-track-player';
await TrackPlayer.play();
```

---

## 🎯 Estratégia de Implementação

### Camada de Abstração
```typescript
interface AudioPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(ms: number): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  setVolume(volume: number): Promise<void>;
}

// Implementar para:
class SpotifyPlayer implements AudioPlayer { }
class LocalPlayer implements AudioPlayer { }
```

### Token Management
```typescript
interface TokenManager {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  
  refresh(): Promise<void>;
  isExpired(): boolean;
}
```

---

## 📦 Dados Importantes para Cache

### Metadata da Track
```typescript
interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  uri: string;
  preview_url?: string; // URL de 30s preview
  explicit: boolean;
  isLocal: boolean; // Flag para tracks locais
}
```

### Queue State
```typescript
interface QueueState {
  current: Track | null;
  queue: Track[];
  history: Track[];
  shuffleEnabled: boolean;
  repeatMode: 'off' | 'one' | 'all';
}
```

---

## 🚀 Exemplo Completo de Request

```typescript
// Play uma track
const playTrack = async (trackUri: string, accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: [trackUri],
      position_ms: 0,
    }),
  });
  
  if (response.status === 204) {
    console.log('Playback started!');
  } else if (response.status === 403) {
    console.error('User not premium');
  } else if (response.status === 404) {
    console.error('No active device');
  }
};
```

---

## ✅ Checklist de Implementação

- [ ] Implementar OAuth PKCE flow
- [ ] Gerenciar tokens (access + refresh)
- [ ] Criar abstração AudioPlayer
- [ ] Implementar SpotifyPlayer (remote control)
- [ ] Implementar LocalPlayer (expo-av/track-player)
- [ ] Sistema de queue com shuffle/repeat
- [ ] Persistir estado (AsyncStorage)
- [ ] Handle rate limits e errors
- [ ] UI para now playing
- [ ] Background playback
- [ ] Lock screen controls (iOS/Android)

---

**Referências Oficiais:**
- https://developer.spotify.com/documentation/web-api
- https://developer.spotify.com/documentation/ios
- https://developer.spotify.com/documentation/android
