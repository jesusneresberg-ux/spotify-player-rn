# ⚡ Spotify Player - Quick Reference

## 🎯 Overview

Você tem uma implementação **completa e pronta para usar** de um clone do Spotify Player para React Native/Expo.

### O que foi criado:

✅ **Audio Engine** - Suporta Spotify API + arquivos locais  
✅ **State Management** - Zustand com persistência  
✅ **OAuth Authentication** - Seguro com PKCE  
✅ **UI Components** - 5 componentes React Native prontos  
✅ **Queue Management** - Com shuffle/repeat inteligente  
✅ **Full Documentation** - 4 guias completos  

---

## 🚀 Primeiros 10 Minutos

### 1. Registrar no Spotify (2 min)
```
https://developer.spotify.com/dashboard
→ Create an App
→ Copy Client ID
→ Add Redirect URI: exp://localhost:19000/--/spotify-callback
```

### 2. Setup Projeto (3 min)
```bash
npm install
cp .env.example .env
# Editar .env com seu Client ID
```

### 3. Rodar (2 min)
```bash
npm run ios    # ou android
```

### 4. Testar Fluxo
- Login com Spotify (OAuth)
- Abrir app Spotify no device
- Play/pause na tela do nosso app
- ✅ Deve funcionar!

---

## 📚 Arquivos Principais

### Por Objetivo

#### 🎵 "Quero tocar música"
Ler: `src/core/audio/PlayerController.ts`
```typescript
const controller = new PlayerController();
await controller.init(config);
await controller.playTrack(track);
```

#### 🔐 "Quero autenticar com Spotify"
Ler: `src/core/auth/SpotifyAuth.ts`
```typescript
const auth = new SpotifyAuth(clientId, redirectUri);
const { accessToken, refreshToken } = await auth.startAuth();
```

#### 💾 "Quero persistir estado"
Ler: `src/stores/playerStore.ts`
```typescript
const { playback, queue } = usePlayerStore();
// Automaticamente salvo em AsyncStorage
```

#### 🎨 "Quero um componente UI"
Ler: `src/ui/screens/PlayerScreen.tsx`
```typescript
<PlayerScreen />  // Full featured player
```

#### 🔍 "Preciso buscar tracks"
Ler: `src/stores/searchStore.ts`
```typescript
const { search, results } = useSearchStore();
await search('The Beatles', accessToken);
```

---

## 🔧 Cheat Sheet

### Tocar uma Track

```typescript
import { usePlayerStore } from '@/stores/playerStore';
import { Track } from '@/core/audio/types';

export function PlayButton() {
  const { playTrack } = usePlayerStore();
  
  const track: Track = {
    id: '1',
    title: 'Song',
    artist: 'Artist',
    album: 'Album',
    duration: 180000,
    uri: 'spotify:track:abc',
    isLocal: false,
  };
  
  return (
    <Button onPress={() => playTrack(track)}>
      Play
    </Button>
  );
}
```

### Controlar Playback

```typescript
const { 
  play, 
  pause, 
  next, 
  previous, 
  seek 
} = usePlayerStore();

await play();           // Play
await pause();          // Pause
await next();           // Próxima
await previous();       // Anterior
await seek(60000);      // Ir para 1 min
```

### Gerenciar Fila

```typescript
const {
  queue,
  currentIndex,
  addToQueue,
  removeFromQueue,
  moveQueueItem,
  clearQueue,
} = usePlayerStore();

addToQueue(track);        // Adicionar 1
addToQueue([t1, t2, t3]); // Adicionar múltiplas
removeFromQueue(2);       // Remover índice 2
moveQueueItem(0, 3);      // Mover de 0 para 3
clearQueue();             // Limpar tudo
```

### Modos

```typescript
const {
  shuffle,
  repeat,
  toggleShuffle,
  setRepeatMode,
} = usePlayerStore();

await toggleShuffle();                  // ON/OFF
await setRepeatMode(RepeatMode.OFF);   // Sem repetição
await setRepeatMode(RepeatMode.ALL);   // Repetir fila
await setRepeatMode(RepeatMode.ONE);   // Repetir track
```

### Estado do Player

```typescript
const { playback } = usePlayerStore();

playback.track?.title        // Título atual
playback.isPlaying           // Tocando?
playback.position            // Posição em ms
playback.duration            // Duração em ms
playback.state               // IDLE/PLAYING/PAUSED/ERROR
playback.error               // Mensagem de erro
```

### Autenticação

```typescript
const { 
  accessToken,
  isTokenExpired,
  refreshAccessToken,
  logout,
} = useAuthStore();

if (isTokenExpired()) {
  await refreshAccessToken();  // Auto renovar
}

await logout();  // Logout
```

### Busca

```typescript
const { search, results, isLoading } = useSearchStore();

await search('The Beatles', accessToken);

results.tracks   // Tracks encontrados
results.albums   // Álbuns
results.artists  // Artistas
```

---

## 🎨 Componentes Disponíveis

### `<PlayerScreen />`
Full player screen com tudo
```typescript
import { PlayerScreen } from '@/ui/screens/PlayerScreen';

<PlayerScreen />
```

### `<PlayerControls />`
Botões Play/Pause/Skip
```typescript
import { PlayerControls } from '@/ui/components/PlayerControls';

<PlayerControls size="large" />
// size: "small" | "large"
```

### `<ProgressBar />`
Barra de progresso interativa
```typescript
import { ProgressBar } from '@/ui/components/ProgressBar';

<ProgressBar showTime={true} />
```

### `<NowPlayingCard />`
Artwork + metadados
```typescript
import { NowPlayingCard } from '@/ui/components/NowPlayingCard';

<NowPlayingCard />
```

### `<ModeButtons />`
Shuffle e Repeat
```typescript
import { ModeButtons } from '@/ui/components/ModeButtons';

<ModeButtons size="large" />
```

---

## 🐛 Problemas Comuns

### "No active device"
```
→ Abra app Spotify no device
→ Toque algo (play um segundo)
→ Volte pro nosso app
→ Tente novamente
```

### "Token expired"
```
Implementado automaticamente em:
- useAuthStore.isTokenExpired()
- useAuthStore.refreshAccessToken()

Use antes de qualquer API call
```

### "Playback failed"
```
Checklist:
1. Spotify Premium? (necessário para streaming via API)
2. Internet? (WiFi/4G ativo)
3. Device ativo? (Spotify app rodando)
4. Token válido? (useAuthStore)
```

### "App não abre"
```bash
npm install
npm run lint
npm run type-check
# Depois tente de novo
```

---

## 📱 Estrutura de Pastas

Você precisa criar:

```
spotify-player-rn/
├── src/
│   ├── core/
│   │   ├── audio/        ← AudioPlayer, SpotifyPlayer, etc
│   │   └── auth/         ← SpotifyAuth
│   ├── stores/           ← playerStore, authStore, searchStore
│   ├── ui/
│   │   ├── components/   ← PlayerControls, ProgressBar, etc
│   │   └── screens/      ← PlayerScreen
│   └── utils/            ← formatters, constants
├── app/                  ← Expo Router (criar depois)
└── assets/               ← Fotos, ícones, fonts
```

**Todos os arquivos .ts/.tsx já foram gerados!**

---

## 🔑 Conceitos-Chave

### Audio Abstraction
```
AudioPlayer (interface comum)
├── SpotifyPlayer (API remote)
└── LocalPlayer (expo-av)

PlayerController
└── Orquestra ambos
```

### State Management
```
Zustand Stores (global state)
└── Auto-persistem em AsyncStorage
└── Atualizam componentes em tempo real
```

### Authentication
```
OAuth PKCE Flow
├── Sem client secret (seguro mobile)
├── Code verifier + challenge
└── Refresh token automático
```

### Queue Logic
```
PlayerController.queue[]
├── Fisher-Yates shuffle
├── Repeat (off/all/one)
└── History tracking
```

---

## 🚀 Próximos Passos

### Curto Prazo (hoje)
1. ✅ Registrar app no Spotify Developer
2. ✅ Setup projeto local
3. ✅ Testar fluxo de login
4. ✅ Testar playback

### Médio Prazo (semana)
- [ ] Customizar cores/fonts
- [ ] Adicionar screens adicionais
- [ ] Integrar com seu backend (se tiver)
- [ ] Testes unitários

### Longo Prazo (mês+)
- [ ] Publicar na App Store/Play Store
- [ ] Adicionar features (lyrics, visualizer)
- [ ] Otimizar performance
- [ ] Analytics & crash reporting

---

## 📞 Onde Encontrar Ajuda

### Cada aspecto tem documentação:

| Assunto | Arquivo |
|---------|---------|
| Setup inicial | SETUP_GUIDE.md |
| API Spotify | SPOTIFY_API_DOCS.md |
| Arquivos gerados | FILES_GENERATED.md |
| Overview completo | README.md |
| Inline code | .ts/.tsx files |

---

## ✅ Checklist - Pronto Para Começar?

- [ ] Registrei app no Spotify Developer Dashboard
- [ ] Copiei Client ID para .env
- [ ] Rodei `npm install`
- [ ] Li SETUP_GUIDE.md
- [ ] Testei `npm run ios/android`
- [ ] Fiz login com Spotify
- [ ] Consegui tocar uma música

**Se tudo checkado → 🎉 Parabéns! Você tem um player Spotify funcional!**

---

## 🎓 Aprendi com isto:

✅ OAuth 2.0 & PKCE  
✅ Abstract base classes  
✅ Observer pattern  
✅ State management  
✅ React Native  
✅ TypeScript avançado  
✅ Async/await patterns  
✅ API integration  
✅ UI/UX design  
✅ Mobile best practices  

---

## 🙌 Apoie este Projeto

Se achou útil:
- ⭐ Star no GitHub
- 📲 Compartilhe
- 🐛 Reporte bugs
- 💡 Sugira features

---

**Divirta-se construindo! 🎵**

