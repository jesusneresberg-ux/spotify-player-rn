# 📦 Download do APK - Spotify Player

## 🚀 Instalação Rápida

### Opção 1: GitHub Releases (Recomendado)

1. Acesse: https://github.com/jesusneresberg-ux/spotify-player-rn/releases
2. Baixe o arquivo `spotify-player-v1.0.0.apk`
3. Instale no seu Android
4. Abra o app e faça login com Spotify

### Opção 2: GitHub Actions Artifacts

Se não houver release ainda, o APK está nos artifacts do workflow:

1. Vá em: https://github.com/jesusneresberg-ux/spotify-player-rn/actions
2. Clique no workflow run mais recente ✅
3. Role até "Artifacts" no final da página
4. Baixe `spotify-player-apk.zip`
5. Extraia o APK e instale

---

## ⚙️ Build Automático

O APK é gerado automaticamente via GitHub Actions sempre que há um push na branch `main`.

### Como funciona:

```
Push no GitHub → GitHub Actions inicia
    ↓
Setup Node.js + Java 17 + Android SDK
    ↓
npm ci + expo prebuild
    ↓
./gradlew assembleRelease
    ↓
APK gerado em android/app/build/outputs/apk/release/
    ↓
Upload como artifact (30 dias)
```

### Trigger manual:

```bash
# Na aba Actions do GitHub:
1. Clique em "Build APK"
2. Run workflow → main branch
3. Aguarde ~5-8 minutos
4. Baixe o artifact
```

---

## 📋 Requisitos do Dispositivo

- **Android:** 5.0 (Lollipop) ou superior
- **Arquitetura:** ARM64, ARMv7, x86, x86_64
- **Espaço:** ~50 MB
- **Permissões:**
  - 🔊 Gravação de áudio (para playback)
  - 📂 Leitura de armazenamento (para músicas locais)

---

## 🔑 Configurar Credenciais Spotify

Antes de usar o app, você precisa configurar as credenciais do Spotify:

### 1. Criar App no Spotify Dashboard

1. Vá em: https://developer.spotify.com/dashboard
2. Clique em "Create app"
3. Preencha:
   - **App name:** Spotify Player RN
   - **App description:** Mobile music player
   - **Redirect URI:** `spotifyplayer://callback`
   - **API/SDKs:** Mobile (iOS/Android)

### 2. Obter Credenciais

Após criar o app, copie:
- **Client ID** (ex: `a1b2c3d4e5f6...`)

### 3. Configurar no App

⚠️ **Atenção:** Como este é um APK de build público, as credenciais precisam estar **hardcoded** ou em um backend.

Você tem 3 opções:

#### **Opção A: Rebuild com suas credenciais (Recomendado)**

1. Clone o repo: `git clone https://github.com/jesusneresberg-ux/spotify-player-rn.git`
2. Crie `.env.local`:
   ```env
   EXPO_PUBLIC_SPOTIFY_CLIENT_ID=SEU_CLIENT_ID_AQUI
   EXPO_PUBLIC_SPOTIFY_REDIRECT_URI=spotifyplayer://callback
   ```
3. Build localmente: `npm run android`

#### **Opção B: Configurar in-app (requires code change)**

Edite `src/utils/constants.ts`:
```typescript
export const SPOTIFY_CONFIG = {
  clientId: 'SEU_CLIENT_ID_AQUI', // ← Coloque aqui
  redirectUri: 'spotifyplayer://callback',
  // ...
};
```

#### **Opção C: Backend proxy (produção)**

Configure um backend que guarde o `client_id` e `client_secret` secretos.

---

## 🔧 Solução de Problemas

### "App não instalado"

**Causa:** Assinatura desconhecida (unsigned APK)

**Solução:**
1. Vá em **Configurações → Segurança**
2. Habilite **Fontes desconhecidas** ou **Instalar apps desconhecidos**
3. Tente instalar novamente

### "O app continua fechando"

**Causa:** Falta de credenciais do Spotify

**Solução:**
- Siga a seção "Configurar Credenciais Spotify" acima
- Ou use o modo **Local Files Only** (sem login)

### "Spotify não está tocando"

**Causa:** Token OAuth expirado ou app Spotify não está rodando

**Solução:**
1. Abra o app oficial do Spotify
2. Toque em qualquer música
3. Volte para o Spotify Player RN
4. Tente novamente

---

## 🎯 Funcionalidades Disponíveis no APK

✅ Reprodução de músicas locais (sem login)  
✅ OAuth Spotify (com credenciais configuradas)  
✅ Controles: Play/Pause, Skip, Seek  
✅ Fila de reprodução com shuffle/repeat  
✅ Busca de músicas (Spotify)  
✅ Progress bar com tempo decorrido  
✅ Volume control  

---

## 📱 Testado em:

- ✅ Android 11 (Pixel 4a)
- ✅ Android 12 (Samsung Galaxy S21)
- ✅ Android 13 (OnePlus 9 Pro)
- ⚠️ Android 5.0+ (untested but should work)

---

## 🐛 Reportar Bugs

Encontrou um problema? Abra uma issue:

https://github.com/jesusneresberg-ux/spotify-player-rn/issues/new

Inclua:
- Modelo do dispositivo
- Versão do Android
- Passos para reproduzir
- Screenshots (se possível)

---

## 🔄 Atualizações

Para receber notificações de novas versões:

1. ⭐ **Star** o repositório
2. 👁️ **Watch** → Custom → Releases
3. Você receberá um email quando houver nova release

---

## 📜 License

MIT License - veja [LICENSE](../LICENSE) para detalhes.
