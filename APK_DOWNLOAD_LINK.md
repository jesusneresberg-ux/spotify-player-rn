# 📦 Link do APK - Spotify Player RN

## 🚀 Como Baixar o APK Agora

**📍 Link da Release:** https://github.com/jesusneresberg-ux/spotify-player-rn/releases/tag/v1.0.0

⚠️ **Status Atual:** O workflow de build automático está com problemas técnicos no GitHub Actions. O APK ainda não está disponível automaticamente.

---

## 🔧 Soluções Alternativas

### ✅ Opção 1: Build Local (Recomendado)

Clone o repositório e faça build localmente:

\`\`\`bash
# 1. Clone o repo
git clone https://github.com/jesusneresberg-ux/spotify-player-rn.git
cd spotify-player-rn

# 2. Instale dependências
npm install

# 3. Build para Android
npx expo run:android --variant release

# O APK estará em: android/app/build/outputs/apk/release/app-release.apk
\`\`\`

**Requisitos:**
- Node.js 18+
- Java 17
- Android SDK
- Android Studio (ou CLI tools)

---

### ✅ Opção 2: EAS Build (Expo Cloud)

\`\`\`bash
# 1. Clone o repo
git clone https://github.com/jesusneresberg-ux/spotify-player-rn.git
cd spotify-player-rn

# 2. Instale dependências e EAS
npm install
npm install -g eas-cli

# 3. Login no Expo
eas login

# 4. Build APK
eas build --platform android --profile preview
\`\`\`

O EAS gerará o APK na nuvem e te enviará um link para download.

---

### ✅ Opção 3: Usar Expo Go (Sem build)

Para testar o app sem fazer build:

\`\`\`bash
# 1. Clone e instale
git clone https://github.com/jesusneresberg-ux/spotify-player-rn.git
cd spotify-player-rn
npm install

# 2. Inicie o servidor
npx expo start

# 3. Escaneie o QR Code com o app Expo Go (Android/iOS)
# Download: https://expo.dev/go
\`\`\`

⚠️ **Limitação:** Funcionalidades nativas podem não funcionar no Expo Go.

---

## 📋 Problema com GitHub Actions

O workflow está falhando em:
- **Setup Node.js v4** - Problema de compatibilidade
- **expo prebuild** - Requer instalação global do Expo CLI

**Correções tentadas:**
- ✅ Downgrade para Node 18
- ✅ Downgrade ações para v3
- ✅ Instalação global do Expo CLI
- ⏳ Workflow ainda precisa de ajustes

---

## 📱 Quando o APK Estará Disponível?

Estou trabalhando em corrigir o workflow. Opções:

1. **Usar um serviço de CI/CD diferente** (AppCenter, Bitrise, CircleCI)
2. **Build manual e upload** direto na Release
3. **Configurar EAS Build** no GitHub Actions

---

## 🆘 Precisa do APK Urgente?

Se você precisa testar agora:

1. **Clone o repo** localmente
2. **Siga a Opção 1** (Build Local) acima
3. Ou use **Expo Go** (Opção 3) para testar sem build

---

## 📖 Documentação Completa

- [Setup Guide](https://github.com/jesusneresberg-ux/spotify-player-rn/blob/main/SETUP_GUIDE.md)
- [Build Guide](https://github.com/jesusneresberg-ux/spotify-player-rn/blob/main/docs/BUILD_APK_GUIDE.md)
- [APK Installation Guide](https://github.com/jesusneresberg-ux/spotify-player-rn/blob/main/docs/APK_DOWNLOAD.md)

---

## 💡 Por Que Não Usar um APK Pre-Compilado?

Builds automatizados garantem:
- ✅ Código sempre atualizado
- ✅ Build reproduzível
- ✅ Sem APKs modificados/maliciosos
- ✅ Transparência total

Prefiro resolver o workflow do que subir um APK manual que pode ficar desatualizado.

---

## 🔔 Atualizações

⭐ **Star o repo** para receber notificações quando o APK estiver disponível!

Assim que o workflow estiver funcionando, vou:
1. Atualizar esta página
2. Criar uma nova release
3. Anexar o APK automaticamente

---

## 📬 Contato

Dúvidas ou problemas? Abra uma issue:

https://github.com/jesusneresberg-ux/spotify-player-rn/issues/new

---

**Última atualização:** 2026-11-01
