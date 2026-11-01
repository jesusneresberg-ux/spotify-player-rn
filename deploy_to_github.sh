#!/bin/bash

# 📤 Script para publicar no GitHub automaticamente
# Uso: ./deploy_to_github.sh <GITHUB_TOKEN> <GITHUB_USERNAME> [REPO_NAME]

set -e  # Exit on error

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Validação de argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ Erro: Argumentos insuficientes${NC}"
    echo "Uso: $0 <GITHUB_TOKEN> <GITHUB_USERNAME> [REPO_NAME]"
    echo ""
    echo "Exemplo:"
    echo "  $0 ghp_xxxxxxxxxxxx berg- spotify-player-rn"
    exit 1
fi

GITHUB_TOKEN=$1
GITHUB_USERNAME=$2
REPO_NAME=${3:-spotify-player-rn}

echo -e "${BLUE}📤 Iniciando publicação no GitHub...${NC}"
echo ""
echo -e "${YELLOW}ℹ️  Configuração:${NC}"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Token: $(echo $GITHUB_TOKEN | cut -c1-10)..."
echo ""

# Step 1: Criar repositório via API GitHub
echo -e "${BLUE}📋 Step 1/5: Criando repositório no GitHub...${NC}"

REPO_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"Full-featured Spotify player for React Native/Expo\",
    \"homepage\": \"https://github.com/$GITHUB_USERNAME/$REPO_NAME\",
    \"private\": false,
    \"has_issues\": true,
    \"has_projects\": true,
    \"has_downloads\": true,
    \"auto_init\": false
  }")

# Verificar se repo foi criado
REPO_URL=$(echo $REPO_RESPONSE | grep -o '"clone_url":"[^"]*"' | cut -d'"' -f4)

if [ -z "$REPO_URL" ]; then
    echo -e "${YELLOW}⚠️  Repositório pode já existir. Continuando...${NC}"
    REPO_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
else
    echo -e "${GREEN}✅ Repositório criado com sucesso!${NC}"
fi

# Step 2: Inicializar Git
echo -e "${BLUE}📋 Step 2/5: Inicializando Git...${NC}"

if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Repositório Git já existe. Pulando init...${NC}"
else
    git init
    echo -e "${GREEN}✅ Git inicializado${NC}"
fi

# Step 3: Adicionar e fazer commit
echo -e "${BLUE}📋 Step 3/5: Adicionando arquivos...${NC}"

git add .
echo -e "${GREEN}✅ Arquivos adicionados${NC}"

echo -e "${BLUE}📋 Step 4/5: Fazendo commit inicial...${NC}"

git config user.email "github@example.com"
git config user.name "GitHub Publisher"

if git commit -m "feat: initial commit - Spotify player React Native implementation"; then
    echo -e "${GREEN}✅ Commit feito${NC}"
else
    echo -e "${YELLOW}⚠️  Nada novo para commitar${NC}"
fi

# Step 4: Configurar remote e push
echo -e "${BLUE}📋 Step 5/5: Enviando para GitHub...${NC}"

# Remover remote existente se houver
git remote remove origin 2>/dev/null || true

# Adicionar novo remote com token
git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Renomear branch para main
git branch -M main

# Push com token
if git push -u origin main; then
    echo -e "${GREEN}✅ Push concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    exit 1
fi

# Step 5: Configurar topics
echo -e "${BLUE}📋 Configurando topics no GitHub...${NC}"

curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.mercy-preview+json" \
  https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/topics \
  -d '{
    "names": ["spotify", "react-native", "expo", "music-player", "oauth", "typescript"]
  }' > /dev/null

echo -e "${GREEN}✅ Topics configurados${NC}"

# Sucesso!
echo ""
echo -e "${GREEN}🎉 Projeto publicado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📍 Seu repositório está em:${NC}"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo -e "${BLUE}🎯 Próximos passos:${NC}"
echo "   1. Visitar o repositório no GitHub"
echo "   2. Adicionar badges ao README"
echo "   3. Compartilhar nas redes sociais"
echo ""
echo -e "${YELLOW}💡 Comandos úteis:${NC}"
echo "   git pull origin main              # Trazer atualizações"
echo "   git checkout -b feature/novo      # Criar nova feature"
echo "   git push origin feature/novo      # Enviar branch"
echo ""
echo -e "${GREEN}✨ Pronto! Seu projeto está no GitHub!${NC}"
