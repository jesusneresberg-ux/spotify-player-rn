# 📤 Guia - Publicar no GitHub

Este guia descreve como publicar seu projeto no GitHub em poucos minutos.

---

## ✅ Pré-requisitos

- [Git](https://git-scm.com/downloads) instalado
- Conta GitHub criada (https://github.com/signup)
- GitHub Desktop (opcional, mas facilita)

---

## 🚀 Passo 1: Criar Repositório no GitHub

### Via GitHub Web

1. Faça login em https://github.com
2. Clique em **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   ```
   Repository name: spotify-player-rn
   Description: Full-featured Spotify player for React Native/Expo
   Public: ✓ (já que escolheu público)
   Add .gitignore: Skip (você já tem)
   Add a README: Skip (você já tem)
   Choose a license: Skip (você já tem LICENSE)
   ```
5. Clique **"Create repository"**

### Copiar URL

Na página do repositório novo, copie a URL:
```
https://github.com/SEU_USERNAME/spotify-player-rn.git
```

---

## 🚀 Passo 2: Inicializar Git Localmente

Na pasta do seu projeto:

```bash
# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Criar primeiro commit
git commit -m "feat: initial commit - Spotify player React Native implementation"

# Renomear branch para main (se necessário)
git branch -M main
```

---

## 🚀 Passo 3: Conectar ao Repositório Remoto

```bash
# Adicionar remote origin
git remote add origin https://github.com/SEU_USERNAME/spotify-player-rn.git

# Verificar
git remote -v
# Deve mostrar:
# origin  https://github.com/SEU_USERNAME/spotify-player-rn.git (fetch)
# origin  https://github.com/SEU_USERNAME/spotify-player-rn.git (push)
```

---

## 🚀 Passo 4: Push para GitHub

```bash
# Push do primeiro commit
git push -u origin main

# Será pedido para autenticar:
# Opção 1: PAT (Personal Access Token) - recomendado
# Opção 2: GitHub App
# Opção 3: SSH key
```

### Autenticação com PAT (Recomendado)

1. Ir para https://github.com/settings/tokens/new
2. Clicar em "Generate new token"
3. Selecionar escopos:
   - `repo` (full control)
   - `workflow` (para CI/CD depois)
4. Copiar token
5. Cola o token quando git pedir password

---

## ✅ Verificar Upload

Ir para https://github.com/SEU_USERNAME/spotify-player-rn e verificar:

- ✅ Todos os arquivos foram enviados
- ✅ README.md aparece na página inicial
- ✅ .gitignore está presente
- ✅ LICENSE aparece

---

## 📋 Estrutura do Repositório

Seu repositório agora terá:

```
spotify-player-rn/
├── src/                 # Código-fonte
├── assets/              # Imagens, ícones
├── __tests__/           # Testes
├── app/                 # Expo Router (não gerado, criar depois)
├── README.md            # 📌 Documentação principal
├── SETUP_GUIDE.md       # Guia de setup
├── QUICK_REFERENCE.md   # Cheat sheet
├── SPOTIFY_API_DOCS.md  # Referência API
├── CONTRIBUTING.md      # 📌 Para contribuidores
├── CHANGELOG.md         # 📌 Histórico de versões
├── LICENSE              # 📌 MIT License
├── .gitignore           # 📌 Arquivos ignorados
├── .env.example         # 📌 Template de env
├── package.json         # 📌 Dependências
└── tsconfig.json        # 📌 Config TypeScript
```

---

## 🎁 Extras - GitHub Features

### 1. Adicionar Topics

No repositório, clique em "About" (engrenagem) e adicione topics:
- `spotify`
- `react-native`
- `expo`
- `music-player`
- `oauth`
- `typescript`

Isso ajuda na descoberta do projeto!

### 2. Adicionar Badges no README

Editar `README.md` e adicionar no topo:

```markdown
# 🎵 Spotify Player React Native

[![GitHub Stars](https://img.shields.io/github/stars/SEU_USERNAME/spotify-player-rn?style=social)](https://github.com/SEU_USERNAME/spotify-player-rn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51-black?logo=expo)](https://expo.dev)

...
```

### 3. Adicionar GitHub Actions (CI/CD)

Criar `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
```

Isso vai rodar testes automaticamente em cada push!

### 4. Criar Issues Templates

Criar `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Reportar um bug encontrado
title: '[BUG] '
labels: 'bug'
---

## Descrição
...

## Passos para Reproduzir
...

## Esperado
...

## Atual
...
```

---

## 📈 Depois de Publicar

### Imediato (hoje)
- [ ] Verificar se tudo foi enviado
- [ ] Adicionar topics
- [ ] Adicionar badges

### Curto prazo (1 semana)
- [ ] Criar primeira issue de exemplo
- [ ] Criar exemplo PR
- [ ] Testar o readme funciona
- [ ] Compartilhar no Reddit/Twitter

### Médio prazo (1 mês)
- [ ] Adicionar GitHub Actions
- [ ] Adicionar issue templates
- [ ] Criar wiki com tutoriais
- [ ] Documentação expandida

### Longo prazo
- [ ] Publicar releases (GitHub Releases)
- [ ] Publicar no npm
- [ ] Suporte a contributors
- [ ] Manutenção contínua

---

## 🔄 Workflow Diário

Depois que publicar, para fazer mudanças:

```bash
# 1. Criar branch para feature
git checkout -b feature/meu-novo-recurso

# 2. Fazer mudanças
# (editar arquivos...)

# 3. Commit
git add .
git commit -m "feat: adicionar novo recurso"

# 4. Push
git push origin feature/meu-novo-recurso

# 5. Criar Pull Request no GitHub
# (clique no botão "New pull request" na página)

# 6. Fazer review/merge
# (você mesmo ou um revisor)

# 7. Deletar branch
git branch -d feature/meu-novo-recurso
git push origin --delete feature/meu-novo-recurso
```

---

## 🎯 Comandos Frequentes

```bash
# Ver status
git status

# Ver histórico
git log --oneline

# Ver branches
git branch -a

# Mudar de branch
git checkout main
git checkout feature/seu-feature

# Trazer atualizações do remoto
git pull origin main

# Enviar mudanças
git push origin main

# Deletar branch local
git branch -d feature/antigo

# Deletar branch remoto
git push origin --delete feature/antigo
```

---

## ✅ Checklist Final

Antes de compartilhar seu repositório:

- [ ] README.md completo e claro
- [ ] SETUP_GUIDE.md funciona
- [ ] Código está bem comentado
- [ ] .gitignore adequado
- [ ] LICENSE está presente
- [ ] CONTRIBUTING.md explica como contribuir
- [ ] Topics adicionados
- [ ] Badges (opcional mas legal)
- [ ] Primeira versão foi feita
- [ ] Descrição no GitHub é clara

---

## 🚀 Compartilhar Seu Projeto

### Reddit
- r/reactnative
- r/webdev
- r/opensource

### Twitter
```
🎵 Criei um full-featured Spotify player em React Native/Expo!

✨ OAuth 2.0
✨ Queue management
✨ Spotify + Local audio
✨ 3500+ linhas de código

Confira: github.com/SEU_USERNAME/spotify-player-rn

#ReactNative #Expo #Spotify #OpenSource
```

### Dev.to
Criar post: "Building a Spotify Player Clone with React Native"

### LinkedIn
Postar sobre aprendizado e projeto

---

## 📞 Próximas Etapas

Depois do repositório estar online:

1. **Adicionar badges** - Melhor visual
2. **GitHub Actions** - Automação
3. **Releases** - Versionar código
4. **NPM Package** (opcional) - Publicar biblioteca
5. **EAS Build** - Build mobile CI/CD
6. **Manutenção** - PRs, issues, updates

---

## 🎓 Recursos

- [GitHub Docs](https://docs.github.com)
- [Git Tutorial](https://git-scm.com/doc)
- [GitHub Badges](https://shields.io)
- [Semantic Versioning](https://semver.org)

---

**Pronto para publicar? 🚀**

