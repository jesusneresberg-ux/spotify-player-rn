# 📤 Publicar no GitHub - Quick Start (3 min)

## ⚡ Resumo

Você vai criar um repositório GitHub público e enviar seu código em 3 minutos.

---

## 🔑 Passos Rápidos

### 1️⃣ Criar Repositório no GitHub (1 min)

```
1. Ir para https://github.com/new
2. Repository name: spotify-player-rn
3. Description: Full-featured Spotify player for React Native/Expo
4. Public: ✓
5. Clique "Create repository"
```

Copie a URL que aparecer: `https://github.com/SEU_USERNAME/spotify-player-rn.git`

---

### 2️⃣ Enviar Código (2 min)

Na pasta do projeto, execute:

```bash
# Inicializar git
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: initial commit - Spotify player React Native"

# Conectar ao GitHub (substitua a URL)
git remote add origin https://github.com/SEU_USERNAME/spotify-player-rn.git

# Renomear branch para main
git branch -M main

# Enviar!
git push -u origin main
```

Quando pedir "password", cole um **Personal Access Token** (PAT):
1. https://github.com/settings/tokens/new
2. Selecionar `repo` e `workflow`
3. Copiar token
4. Cola no terminal

---

## ✅ Pronto!

Seu projeto está no GitHub! 🎉

Acesse: `https://github.com/SEU_USERNAME/spotify-player-rn`

---

## 🎁 Extras (Opcional)

### Adicionar Badges

Editar `README.md`, adicionar no topo:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev)
```

Depois:
```bash
git add README.md
git commit -m "docs: add badges"
git push
```

### Adicionar Topics

No GitHub, clique no ícone de engrenagem perto de "About" e adicione:
- `spotify`
- `react-native`
- `expo`
- `music-player`
- `oauth`

---

## 📋 Checklist

- [ ] Criou repositório no GitHub
- [ ] Executou `git init` e `git add .`
- [ ] Fez `git commit` inicial
- [ ] Conectou com `git remote add origin`
- [ ] Fez `git push -u origin main`
- [ ] Verificou se código está no GitHub
- [ ] Adicionou topics (opcional)

---

## ⚠️ Se Deu Erro

### "fatal: not a git repository"
```bash
git init
git add .
git commit -m "initial commit"
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://seu-url.git
```

### "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### "Authentication failed"
Use um **Personal Access Token** em vez de password:
1. https://github.com/settings/tokens/new
2. Gerar token com `repo` scope
3. Cola token no prompt de password

---

## 📚 Mais Detalhes

Ver **GITHUB_SETUP.md** para:
- Instruções completas
- GitHub Actions setup
- Badges e topics
- Workflow diário

---

## 🎯 Próximos Passos

1. ✅ Publicar (você está aqui)
2. 🎨 Adicionar badges e topics
3. 📝 Criar primeira issue
4. 🤝 Convidar colaboradores
5. 🚀 Publicar releases

---

**Pronto para publicar?** Execute os passos acima! ✨

