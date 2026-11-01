# 🤝 Contribuindo para Spotify Player React Native

Obrigado por considerar contribuir! Este documento fornece diretrizes e instruções.

## 📋 Código de Conduta

Nós nos comprometemos com um ambiente acolhedor e inclusivo. Qualquer forma de harassment será intolerável.

**Comportamento esperado:**
- Ser respeitoso e inclusivo
- Aceitar crítica construtiva
- Focar no que é melhor para a comunidade
- Mostrar empatia com outras pessoas

---

## 🐛 Reportar Bugs

### Antes de Reportar
- Verifique se o bug já foi reportado em [Issues](../../issues)
- Tente reproduzir em um ambiente limpo
- Verifique a documentação (README.md, SETUP_GUIDE.md)

### Como Reportar
Abra uma issue incluindo:

```markdown
## Descrição
[Descrição clara e concisa do bug]

## Passos para Reproduzir
1. [Primeiro passo]
2. [Segundo passo]
3. [...]

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Logs/Screenshots
[Copie erros do console, screenshots, etc]

## Ambiente
- OS: [iOS/Android/Web]
- Versão: [ex: 1.0.0]
- Node.js: [ex: 18.12.0]
- React Native: [ex: 0.74.0]
```

---

## 💡 Sugerir Features

### Antes de Sugerir
- Verifique se a feature já foi sugerida
- Considere se é útil para a maioria dos usuários
- Prepare um use case claro

### Como Sugerir
Abra uma issue com o label `feature-request`:

```markdown
## Descrição
[Descrição clara da feature]

## Use Case
[Por que esta feature é útil?]

## Possível Implementação
[Ideias de como implementar, se tiver]

## Referências
[Links relevantes, exemplos, etc]
```

---

## 💻 Desenvolvendo Localmente

### 1. Fork e Clone
```bash
# Fork no GitHub (botão no topo da página)
git clone https://github.com/YOUR_USERNAME/spotify-player-rn.git
cd spotify-player-rn
git remote add upstream https://github.com/berg-/spotify-player-rn.git
```

### 2. Setup
```bash
npm install
cp .env.example .env
# Editar .env com seu Client ID Spotify
```

### 3. Criar Branch
```bash
git checkout -b feature/amazing-feature
# ou
git checkout -b fix/issue-number
```

### 4. Fazer Mudanças
```bash
# Edite os arquivos
npm run lint        # Verificar estilo
npm run type-check  # Verificar tipos
npm test            # Rodar testes
```

### 5. Commit
```bash
git add .
git commit -m "feat: adicionar feature incrível"
# ou
git commit -m "fix: corrigir bug em PlayerControls"
```

**Formato de commit:**
- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação (sem lógica)
- `refactor:` - Refatoração de código
- `test:` - Testes
- `chore:` - Build, deps, etc

### 6. Push e PR
```bash
git push origin feature/amazing-feature
# Abrir PR no GitHub
```

---

## 📝 Pull Request

### Checklist Antes de PR
- [ ] Código segue o style guide
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Sem breaking changes (ou bem explicado)
- [ ] Commits estão bem estruturados

### Descrição do PR

```markdown
## Descrição
[Descrição clara do que muda]

## Tipo de Change
- [ ] Bug fix (não-breaking)
- [ ] Feature (não-breaking)
- [ ] Breaking change
- [ ] Documentação

## Como foi testado?
[Descreva como testou]

## Screenshots
[Se relevante, adicione screenshots]

## Checklist
- [ ] Código está testado
- [ ] Documentação foi atualizada
- [ ] Sem console.log ou debug code
- [ ] Seguiu o style guide
```

---

## 🎨 Style Guide

### TypeScript
```typescript
// ✅ Bom
export interface PlayerState {
  track: Track | null;
  isPlaying: boolean;
  volume: number;
}

// ❌ Ruim
export interface PlayerState {
  track,
  isPlaying,
  volume
}
```

### React Components
```typescript
// ✅ Bom
export const PlayerControls: React.FC<PlayerControlsProps> = ({ size = 'large' }) => {
  return <View>{/* ... */}</View>;
};

// ❌ Ruim
const PlayerControls = ({ size }) => {
  return <div>{/* ... */}</div>;
};
```

### Naming
- `const` e `let`: `camelCase`
- Funções: `camelCase`
- Classes: `PascalCase`
- Enums: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Interfaces: `PascalCase` (prefixo `I` opcional)

### Imports
```typescript
// ✅ Organizado
import { usePlayerStore } from '@/stores/playerStore';
import { Track, PlaybackState } from '@/core/audio/types';
import { View, Text } from 'react-native';

// ❌ Desordenado
import type { Track } from '@/core/audio/types';
import { View } from 'react-native';
import { usePlayerStore } from '@/stores/playerStore';
```

---

## 📚 Documentação

Ao adicionar features:

1. **Atualizar README.md** se muda comportamento público
2. **Adicionar comentários** em código complexo
3. **Criar/atualizar guias** se necessário
4. **Exemplo de uso** para novas APIs

Exemplo:
```typescript
/**
 * Reproduzir próxima track na fila
 * 
 * @example
 * const { next } = usePlayerStore();
 * await next();
 * 
 * @throws {Error} Se não houver fila ou player não inicializado
 */
async next(): Promise<void>
```

---

## 🧪 Testes

### Adicionar Testes
```bash
npm test -- --watch
```

### Estrutura
```typescript
describe('PlayerController', () => {
  it('should play next track when queue has items', async () => {
    // Arrange
    const controller = new PlayerController();
    
    // Act
    await controller.next();
    
    // Assert
    expect(controller.getCurrentIndex()).toBe(1);
  });
});
```

---

## 📋 Revisão de Código

### Mantenedores Verificam
- ✅ Qualidade do código
- ✅ Segurança
- ✅ Performance
- ✅ Documentação
- ✅ Testes
- ✅ Style consistency

### Feedback
Será construtivo e focado em melhorar. Sempre está aberto a discussão!

---

## 🚀 Release Process

1. Atualizar `package.json` versão
2. Atualizar `CHANGELOG.md`
3. Criar release commit
4. Tag com versão (`v1.0.0`)
5. Publicar no npm (se aplicável)

---

## 💬 Comunicação

- **Issues** - Bugs e features
- **Discussions** - Ideias e perguntas gerais
- **Pull Requests** - Mudanças de código

Preferimos comunicação pública para que outros possam aprender também!

---

## 📚 Recursos

- [README.md](README.md) - Visão geral
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup
- [SPOTIFY_API_DOCS.md](SPOTIFY_API_DOCS.md) - API reference
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ❓ Dúvidas?

- Abra uma issue com a tag `question`
- Envie um email (ver GitHub profile)
- Consulte a documentação primeiro

---

## 🎉 Obrigado!

Sua contribuição torna este projeto melhor. Obrigado por ajudar! ❤️

---

**Desenvolvido com ❤️**
