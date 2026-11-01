# 🚀 Auto Deploy para GitHub - Quick Start

Você tem um **Personal Access Token (PAT)** do GitHub. Agora publique seu projeto **automaticamente** em 1 minuto!

---

## ⚡ Opção 1: Usar Python (RECOMENDADO)

### Pré-requisito
```bash
pip install requests
```

### Executar
```bash
python3 deploy_to_github.py YOUR_TOKEN berg- spotify-player-rn
```

### Argumentos
```
python3 deploy_to_github.py <TOKEN> <USERNAME> [REPO_NAME]
```

**Exemplo:**
```bash
python3 deploy_to_github.py YOUR_TOKEN bergUsername spotify-player-rn
```

---

## ⚡ Opção 2: Usar Bash (Linux/Mac)

### Tornar executável
```bash
chmod +x deploy_to_github.sh
```

### Executar
```bash
./deploy_to_github.sh YOUR_TOKEN berg- spotify-player-rn
```

---

## ⚡ Opção 3: Manual Rápido (Windows/Qualquer SO)

Se os scripts não funcionarem, execute manualmente:

```bash
# 1. Criar repo vazio em https://github.com/new
# Repository: spotify-player-rn
# Público: ✓

# 2. Executar:
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://YOUR_TOKEN@github.com/berg-/spotify-player-rn.git
git push -u origin main
```

---

## ✅ Verificação

Após a publicação, verifique:

1. Ir para https://github.com/berg-/spotify-player-rn
2. Verificar se todos os arquivos estão lá
3. README.md aparece na página inicial
4. Topics adicionados: spotify, react-native, expo

---

## 🎉 Se Tudo Funcionou

```
✅ Repositório criado
✅ Arquivos enviados
✅ Topics configurados
✅ Pronto para colaboração!
```

---

## ⚠️ Segurança do Token

**IMPORTANTE:** Seu token `YOUR_TOKEN` é sensível!

Após publicar:
1. ❌ **NÃO** commite este token em `.git`
2. ❌ **NÃO** compartilhe em público
3. ✅ **PODE** regenerar em https://github.com/settings/tokens se vazar

Opcionalmente, revogar após publicar:
1. https://github.com/settings/tokens
2. Deletar o token usado

---

## 🚀 Próximos Passos

1. ✅ Publicar (execute acima)
2. 📱 Compartilhar no Twitter
3. 🎯 Adicionar badges
4. 👥 Receber PRs

---

**Pronto para publicar? Execute um dos comandos acima! ⚡**
