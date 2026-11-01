# 🚀 Como Gerar o APK no GitHub

## ✨ Resumo Rápido

O APK já está sendo gerado automaticamente! O GitHub Actions está rodando agora:
- **Status:** https://github.com/jesusneresberg-ux/spotify-player-rn/actions
- **Release:** https://github.com/jesusneresberg-ux/spotify-player-rn/releases/tag/v1.0.0

Aguarde ~5-8 minutos e o APK aparecerá anexado à release v1.0.0.

---

## Método 1: Disparar Workflow Manualmente

1. Acesse: https://github.com/jesusneresberg-ux/spotify-player-rn/actions
2. Clique em **"Build APK"** na lista de workflows à esquerda
3. Clique em **"Run workflow"** (botão azul no canto superior direito)
4. Selecione branch **main**
5. Clique em **"Run workflow"** (botão verde)
6. Aguarde ~5-8 minutos
7. O APK estará disponível nos **Artifacts** do workflow run

### Como baixar o APK:

1. Clique no workflow run que acabou de completar ✅
2. Role até o final da página
3. Em **"Artifacts"**, clique em **spotify-player-apk**
4. O arquivo ZIP será baixado
5. Extraia o APK e instale no Android

---

## Método 2: Criar uma Release (APK Público)

### Via Interface Web

1. Vá em: https://github.com/jesusneresberg-ux/spotify-player-rn/releases/new
2. Preencha:
   - **Tag version:** `v1.0.1` (ou próxima versão)
   - **Release title:** `Spotify Player v1.0.1`
   - **Description:**
     ```
     🎉 Release description here

     ## Features
     - List your features

     ## Installation
     Download the APK below and install on Android 5.0+
     ```
3. Clique em **"Publish release"**
4. O workflow será disparado automaticamente
5. Após 5-8 minutos, o APK aparecerá anexado à release

---

## Método 3: Push com Tag

Se você tiver o repo clonado localmente:

```bash
git tag v1.0.1
git push origin v1.0.1
```

O workflow detecta a tag e cria a release automaticamente.

---

## 📦 Link do APK

Após a build completar, o APK estará disponível em:

**https://github.com/jesusneresberg-ux/spotify-player-rn/releases/tag/v1.0.0**

Procure por um arquivo como:
- `app-release.apk`
- `spotify-player-v1.0.0.apk`

---

## ⚙️ Detalhes Técnicos do Workflow

O workflow `build-apk.yml` roda quando:
- ✅ Há push na branch `main`
- ✅ Uma tag `v*` é criada (ex: `v1.0.0`, `v1.2.3`)
- ✅ Dispatch manual via Actions UI

### O que ele faz:

1. **Setup do ambiente:**
   - Node.js 20
   - Java 17 (Temurin)
   - Android SDK

2. **Build:**
   - `npm ci` → instala deps
   - `expo prebuild` → gera pasta `android/`
   - `./gradlew assembleRelease` → compila APK

3. **Output:**
   - APK não-assinado em `android/app/build/outputs/apk/release/`
   - Upload como artifact (retenção: 30 dias)
   - Se for tag, anexa à Release automaticamente

---

## 🔐 APK Assinado (Para Google Play Store)

O workflow atual gera um APK **unsigned** (não-assinado), ideal para testes.

Para publicar na Google Play Store, você precisa assinar:

### 1. Gerar Keystore

```bash
keytool -genkey -v -keystore spotify-player.keystore \
  -alias spotify-player -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Converter para Base64

```bash
base64 spotify-player.keystore > keystore.base64.txt
```

### 3. Adicionar Secrets no GitHub

Vá em: https://github.com/jesusneresberg-ux/spotify-player-rn/settings/secrets/actions

Adicione:
- `KEYSTORE_FILE`: conteúdo de `keystore.base64.txt`
- `KEYSTORE_PASSWORD`: senha do keystore
- `KEY_ALIAS`: `spotify-player`
- `KEY_PASSWORD`: senha da key

### 4. Workflow automaticamente assina

O workflow já tem suporte para keystore. Basta adicionar os secrets e na próxima build o APK sairá assinado.

---

## 📊 Status da Build

Você pode monitorar o progresso da build em:

https://github.com/jesusneresberg-ux/spotify-player-rn/actions

Tempo médio:
- ⚡ **5-8 minutos** para build completo
- 🚀 **30 segundos** para disponibilizar o artifact

---

## ❓ Troubleshooting

### "No artifacts found"

**Causa:** Workflow ainda está rodando ou falhou

**Solução:** Aguarde completar ou verifique os logs

### "Workflow not found"

**Causa:** Arquivo não foi commitado corretamente

**Solução:** Verifique se `.github/workflows/build-apk.yml` existe no repo

### "Build failed"

**Causa:** Erro no código ou deps

**Solução:** Clique no workflow run e veja os logs detalhados

---

## 🎯 Status Atual

✅ Release v1.0.0 criada  
✅ Workflow de build configurado  
⏳ APK sendo gerado (aguarde ~5 minutos)  
📦 Link final: https://github.com/jesusneresberg-ux/spotify-player-rn/releases/tag/v1.0.0
