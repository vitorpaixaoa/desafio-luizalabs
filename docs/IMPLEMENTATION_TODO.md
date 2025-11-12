# 🎧 Fullstack Spotify Challenge — Implementation TODO

## 🧭 Objetivo
Desenvolver um aplicativo **React + Spotify Web API** que:
- Autentica o usuário via OAuth 2.0 com PKCE
- Exibe top artistas, álbuns, playlists e dados do usuário
- Permite criar playlists
- Funciona **offline (cache + sync)**
- Segue o design do Figma do desafio
- Inclui lint, testes, CI e deploy

---

## 🏗️ STACK PRINCIPAL
- **Frontend:** React + TypeScript + Vite
- **UI:** TailwindCSS + shadcn/ui (ou Material UI)
- **Gerenciamento de dados:** React Query (TanStack Query)
- **Autenticação:** OAuth 2.0 PKCE com Spotify API
- **Offline-first:** Workbox (Service Worker + IndexedDB)
- **Testes:** Vitest + React Testing Library
- **Qualidade:** ESLint + Prettier + Husky + lint-staged
- **Deploy:** Vercel
- **Extras (bônus):** Sentry, PWA, CI GitHub Actions

---

## 🗂️ ESTRUTURA DE PASTAS

```
src/
 ├─ app/                 # Rotas e layout principal
 ├─ features/
 │   ├─ auth/            # Login, logout, fluxo PKCE
 │   ├─ artists/         # Top artistas do usuário
 │   ├─ albums/          # Álbuns do artista selecionado
 │   ├─ playlists/       # Listar/criar playlists
 │   └─ user/            # Dados do usuário logado
 ├─ shared/
 │   ├─ api/             # Cliente HTTP, endpoints
 │   ├─ components/      # UI reusável
 │   ├─ lib/             # utils, formatadores, schemas Zod
 │   ├─ stores/          # Zustand/Context API
 │   ├─ styles/          # CSS base
 │   └─ workers/         # Service Worker e Workbox
 └─ tests/               # Testes unitários
```

---

## ✅ TODO LIST — POR FASES

### 🧩 Fase 1: Setup do Projeto
- [ ] Criar projeto com Vite + React + TypeScript  
- [ ] Adicionar TailwindCSS e configurar tema base  
- [ ] Adicionar ESLint, Prettier e EditorConfig  
- [ ] Configurar Husky + lint-staged  
- [ ] Configurar scripts no `package.json`:
  - `dev`, `build`, `lint`, `test`, `preview`
- [ ] Criar README inicial

---

### 🔐 Fase 2: Autenticação com Spotify (OAuth 2.0 PKCE)
- [ ] Criar página `/login` com botão “Entrar com Spotify”
- [ ] Implementar geração de `code_verifier` e `code_challenge` (S256)
- [ ] Redirecionar para o `authorize` endpoint do Spotify
- [ ] Receber `code` e trocar por `access_token` via API
- [ ] Armazenar token de forma segura (memória + IndexedDB)
- [ ] Implementar refresh/reauth simples
- [ ] Criar hook `useSpotifyAuth()`

---

### 🧱 Fase 3: API e Camada de Dados
- [ ] Criar cliente HTTP (`axios` ou `fetch`) com interceptor de token
- [ ] Implementar endpoints:
  - [ ] `GET /me` — dados do usuário
  - [ ] `GET /me/top/artists`
  - [ ] `GET /artists/{id}/albums`
  - [ ] `GET /me/playlists`
  - [ ] `POST /users/{user_id}/playlists`
- [ ] Criar tipagens com **Zod** para respostas
- [ ] Integrar tudo com **React Query** (hooks de dados)

---

### 🎨 Fase 4: Interface (conforme Figma)
- [ ] Página principal `/` (Dashboard) com navegação por abas:
  - [ ] Artistas
  - [ ] Álbuns
  - [ ] Playlists
  - [ ] Conta
- [ ] **Artistas:** listar top artistas (nome, imagem, gênero)
- [ ] **Álbuns:** exibir álbuns de um artista selecionado
- [ ] **Playlists:** listar playlists + botão “Criar nova”
- [ ] **Modal** de criação de playlist (nome, descrição, público/privado)
- [ ] **Conta:** dados do usuário (nome, email, plano)
- [ ] Adicionar loading skeletons e tratamento de erro
- [ ] Adicionar banners de status (“Offline”, “Erro”, “Sincronizando...”)

---

### ⚙️ Fase 5: Paginação
- [ ] Implementar `useInfiniteQuery` do React Query
- [ ] Padrão: `limit=20`, `offset` incremental
- [ ] Infinite scroll com sentinel (IntersectionObserver)
- [ ] Botão “Carregar mais” como fallback

---

### 📡 Fase 6: Offline-first
- [ ] Instalar Workbox
- [ ] Configurar Service Worker:
  - [ ] Cache First para assets estáticos
  - [ ] Stale-While-Revalidate para `GET /me`, `/artists`, `/playlists`
- [ ] Usar IndexedDB para armazenar dados cacheados
- [ ] Implementar fila offline para POST `criar playlist`
- [ ] Mostrar banner “Offline” quando sem conexão

---

### 🧪 Fase 7: Testes
- [ ] Configurar Vitest + React Testing Library
- [ ] Testar:
  - [ ] Hooks de dados (`useUserData`, `useTopArtists`)
  - [ ] Componentes principais (lista, modais, cards)
  - [ ] Comportamento offline (mockado)
- [ ] Adicionar cobertura (`--coverage`)

---

### 🚀 Fase 8: Deploy e CI
- [ ] Adicionar variáveis de ambiente:
  - `VITE_SPOTIFY_CLIENT_ID`
  - `VITE_REDIRECT_URI`
  - `VITE_APP_URL`
- [ ] Deploy no Vercel
- [ ] Configurar `redirect_uri` no dashboard Spotify
- [ ] Configurar CI (GitHub Actions):
  - Lint
  - Test
  - Build
- [ ] Lighthouse (opcional PWA)
- [ ] Atualizar README final

---

## 🧠 BÔNUS (Opcional)
- [ ] Adicionar Sentry para rastrear erros
- [ ] Adicionar manifest PWA
- [ ] Adicionar teste E2E (Cypress ou Playwright)
- [ ] Adicionar cache de dark mode com Zustand

---

## 🧾 README FINAL (Modelo)
O README deve conter:
1. Como rodar (`yarn dev`, `yarn build`, etc)
2. Como registrar app no Spotify Dashboard
3. Explicação do fluxo PKCE
4. Explicação da estrutura de pastas
5. Checklist das features implementadas
6. Links do deploy + Figma

---

## 🧩 Sugestão de Prompt para Cursor

```
Crie um projeto React + TypeScript com Vite e Tailwind.
Implemente autenticação OAuth 2.0 PKCE com a Spotify Web API.
Estruture o projeto conforme o arquivo IMPLEMENTATION_TODO.md.
Use React Query, Zod e Workbox para cache offline.
Crie as rotas, componentes e hooks descritos nas fases.
Garanta que o app funcione offline, crie playlists e exiba top artistas.
Adicione testes unitários com Vitest.
```

---

## 🪣 VARIÁVEIS DE AMBIENTE EXEMPLO

```
VITE_SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_REDIRECT_URI=http://localhost:5173
VITE_APP_URL=http://localhost:5173
```

---

## 💡 DICAS DE IMPLEMENTAÇÃO
- Use **PKCE flow**, não Implicit flow.
- Prefira **React Query + Zod** ao invés de Redux.
- Teste o app **offline no DevTools → Network → Offline**.
- Sempre tratar 401 e 429 da API do Spotify.
- Separe commits por feature com Conventional Commits.

---

**Pronto para execução no Cursor.**
A IA pode seguir a ordem das fases e criar o sistema completo com base neste arquivo.
