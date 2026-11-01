# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/),
e este projeto segue [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-01

### ✨ Added

#### Core - Audio Engine
- Abstract `AudioPlayer` base class com gerenciamento de eventos
- `SpotifyPlayer` implementação com polling e sincronização
- `LocalPlayer` implementação com suporte Expo AV
- `PlayerController` orquestrador central com queue management
- Algoritmo Fisher-Yates para shuffle perfeito
- Sistema de repeat modes (OFF, ALL, ONE)
- Event-driven architecture com EventEmitter

#### Authentication
- OAuth 2.0 flow com PKCE (Proof Key for Code Exchange)
- Secure token storage com Expo SecureStore
- Automatic token refresh com validação
- Session restoration na abertura do app

#### State Management
- `playerStore` com Zustand para estado global do player
- `authStore` para gerenciamento de autenticação
- `searchStore` para buscas e histórico
- Persistência automática com AsyncStorage

#### UI Components
- `PlayerControls` - Play/Pause/Skip com 2 tamanhos
- `ProgressBar` - Seek interativo com drag
- `NowPlayingCard` - Artwork com metadados
- `ModeButtons` - Shuffle e Repeat controls
- `PlayerScreen` - Full player screen com queue preview

#### Utilities
- Formatadores de tempo (MM:SS, HH:MM:SS)
- Constantes centralizadas (cores, spacing, etc)
- Helpers de string (truncate, capitalize, etc)
- Error messages predefinidas

#### Documentation
- README.md completo com arquitetura
- SETUP_GUIDE.md com passo-a-passo
- SPOTIFY_API_DOCS.md referência técnica
- QUICK_REFERENCE.md cheat sheet
- INDEX.md índice de tudo

### 🔧 Configuration

- `package.json` com 20+ dependências
- `tsconfig.json` para TypeScript
- `.env.example` template
- `.gitignore` para Git
- `LICENSE` MIT

### 📦 Dependencies

- react-native 0.74.0
- expo 51.0.0
- zustand 4.5.0
- axios 1.7.0
- expo-av 14.0.0
- expo-secure-store 12.0.0
- @react-native-async-storage/async-storage 1.23.0

---

## [Unreleased]

### 🚀 Roadmap

#### Features Planejadas
- [ ] Sincronização de lyrics
- [ ] Social features (compartilhar playlists)
- [ ] Offline mode com cache
- [ ] Visualizador de áudio
- [ ] Modo multi-device
- [ ] Toggle dark/light theme
- [ ] Equalizer com presets
- [ ] Recomendações smart baseadas em gosto

#### Melhorias
- [ ] Testes unitários completos (Jest)
- [ ] Testes E2E (Detox)
- [ ] Performance profiling
- [ ] Integração com analytics (Firebase)
- [ ] Crash reporting (Sentry)
- [ ] Suporte a i18n (múltiplos idiomas)
- [ ] Push notifications para eventos
- [ ] Deep linking para shares

#### Deployment
- [ ] Configuração EAS Build
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automação de version bumping
- [ ] Auto release notes generation
- [ ] App Store Connect setup
- [ ] Google Play Console setup

---

## Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - Novas features (backward compatible)
- **PATCH** - Bug fixes

---

## Tipos de Mudanças

- **✨ Added** - Novas features
- **🔧 Changed** - Mudanças em funcionalidades existentes
- **🐛 Fixed** - Bug fixes
- **🔐 Security** - Patches de segurança
- **⚠️ Deprecated** - Features que serão removidas
- **🗑️ Removed** - Remoção de features
- **📚 Documentation** - Mudanças em docs
- **⚡ Performance** - Improvements de performance

---

## Diretrizes de Changelog

Ao contribuir, atualize CHANGELOG.md adicionando sua mudança na seção `[Unreleased]` sob o tipo apropriado.

Formato:
```markdown
### ✨ Added
- [#123] Brief description of what was added (PR ou Issue link)
```

---

**Mantido por:** Berg  
**Última atualização:** 2026-11-01
