# 🎵 Spotify Player React Native - Setup Guide

## ✅ Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Conta Spotify Developer (grátis em https://developer.spotify.com)

---

## 🚀 Setup Inicial

### 1. Registrar aplicação no Spotify Developer Dashboard

1. Ir para https://developer.spotify.com/dashboard
2. Fazer login ou criar conta
3. Aceitar termos e criar app
4. Obter **Client ID**
5. Em "Edit Settings", adicionar Redirect URI:
   ```
   exp://localhost:19000/--/spotify-callback
   ```
   (Para produção, usar seu redirect URI)

### 2. Clonar/criar projeto

```bash
npx create-expo-app spotify-player-rn
cd spotify-player-rn
```

### 3. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Editar `.env` e adicionar seu Client ID:

```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_REDIRECT_URI=exp://localhost:19000/--/spotify-callback
```

### 5. Estruturar diretórios

Copiar todos os arquivos TypeScript/tsx criados para a estrutura correta:

```
src/
├── core/
│   ├── audio/
│   │   ├── types.ts
│   │   ├── AudioPlayer.ts
│   │   ├── LocalPlayer.ts
│   │   ├── SpotifyPlayer.ts
│   │   └── PlayerController.ts
│   └── auth/
│       └── SpotifyAuth.ts
├── stores/
│   ├── playerStore.ts
│   ├── authStore.ts
│   └── searchStore.ts
├── ui/
│   ├── components/
│   │   ├── PlayerControls.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── NowPlayingCard.tsx
│   │   └── ModeButtons.tsx
│   └── screens/
│       └── PlayerScreen.tsx
└── utils/
    ├── formatters.ts
    └── constants.ts
```

---

## 📱 Testar no Simulador/Device

### iOS (macOS)

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web (testes)

```bash
npm run web
```

---

## 🔐 Autenticação Spotify

### Fluxo de Login

1. **Iniciar OAuth**
   ```typescript
   const auth = new SpotifyAuth(CLIENT_ID, REDIRECT_URI);
   const { accessToken, refreshToken, userId } = await auth.startAuth();
   ```

2. **Salvar tokens**
   ```typescript
   await useAuthStore.getState().setTokens(
     accessToken,
     refreshToken,
     expiresIn
   );
   ```

3. **Usar no player**
   ```typescript
   await usePlayerStore.getState().initPlayer({
     type: PlayerType.SPOTIFY,
     accessToken,
     spotifyRefreshToken: refreshToken,
   });
   ```

### Renovar Token

O token é renovado automaticamente quando expira:

```typescript
const { isTokenExpired, refreshAccessToken } = useAuthStore();

if (isTokenExpired()) {
  await refreshAccessToken();
}
```

---

## 🎮 Como Usar o Player

### Reproduzir Track

```typescript
const { playTrack } = usePlayerStore();

const track: Track = {
  id: 'track_123',
  title: 'Song Name',
  artist: 'Artist Name',
  album: 'Album Name',
  duration: 180000, // ms
  uri: 'spotify:track:...',
  isLocal: false,
};

await playTrack(track);
```

### Controles Básicos

```typescript
const { play, pause, next, previous, seek } = usePlayerStore();

// Play/Pause
await play();
await pause();

// Navegação
await next();
await previous();

// Seek (ir para posição em ms)
await seek(60000); // Ir para 1 minuto

// Volume (0-100)
await setVolume(50);
```

### Modos

```typescript
const { shuffle, repeat, toggleShuffle, setRepeatMode } = usePlayerStore();

// Shuffle
await toggleShuffle(); // ON/OFF

// Repeat
await setRepeatMode(RepeatMode.OFF);    // Sem repetição
await setRepeatMode(RepeatMode.ALL);    // Repetir toda fila
await setRepeatMode(RepeatMode.ONE);    // Repetir track atual
```

### Gerenciar Fila

```typescript
const { 
  addToQueue, 
  removeFromQueue, 
  moveQueueItem, 
  queue,
  currentIndex 
} = usePlayerStore();

// Adicionar à fila
await addToQueue(track);
await addToQueue([track1, track2, track3]);

// Remover
removeFromQueue(2); // Remover índice 2

// Reorganizar
moveQueueItem(0, 3); // Mover de índice 0 para 3

// Limpar tudo
clearQueue();
```

---

## 🔍 Buscar Tracks

```typescript
const { search, results, isLoading } = useSearchStore();
const { accessToken } = useAuthStore();

// Buscar
await search('The Beatles', accessToken);

// Acessar resultados
console.log(results.tracks);  // Tracks encontrados
console.log(results.albums);  // Álbuns
console.log(results.artists); // Artistas
```

---

## 🛠️ Solução de Problemas

### "No active Spotify device found"

- Abrir app oficial do Spotify no device
- Garantir que está tocando algo
- Voltar para o nosso app

### Token expirado

Implementado automaticamente em todos os componentes:

```typescript
if (isTokenExpired()) {
  await refreshAccessToken();
}
```

### Playback não funciona

1. Verificar se Spotify Premium
2. Verificar conexão de internet
3. Verificar se device está ativo
4. Verificar logs (Ctrl+J no Expo)

### Erro de redirect URI

- Garantir que o URI em `.env` está registrado no Spotify Dashboard
- Para Expo: `exp://localhost:19000/--/spotify-callback`

---

## 📦 Build para Produção

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

**Nota:** Registrar URI de produção no Spotify Dashboard antes de fazer build!

---

## 🎨 Customizações

### Cores

Editar `src/utils/constants.ts`:

```typescript
export const COLORS = {
  PRIMARY: '#1DB954',
  BACKGROUND: '#121212',
  // ...
};
```

### Espaçamentos

```typescript
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  // ...
};
```

### Fontes

Adicionar fontes customizadas em `app.json`:

```json
{
  "expo": {
    "plugins": ["expo-font"],
    "extra": {
      "fonts": ["./assets/fonts/SpotifyBold.ttf"]
    }
  }
}
```

---

## 🧪 Testing

### Estrutura de testes

```bash
npm test
```

Exemplos de testes em `__tests__/`

---

## 📚 Recursos

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Zustand Documentation](https://zustand-demo.vercel.app)

---

## 🤝 Contribuir

Melhorias bem-vindas! Fazer PR com:

- [ ] Descrição clara do que muda
- [ ] Testes (quando aplicável)
- [ ] Sem erros de linting

---

## 📄 Licença

MIT

---

**Desenvolvido com ❤️**
