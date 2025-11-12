# Desafio Magalu — Spotify (Vite + React + TS)

Aplicação SPA (React + TypeScript + Vite) que integra com a Spotify Web API. Implementa autenticação OAuth 2.0 PKCE, listagem de Top Artistas, detalhes de artista com paginação infinita de álbuns, Playlists do usuário (com criação), página de Perfil e PWA instalável. Baseado no arquivo `docs/IMPLEMENTATION_TODO.md`.

---

## 1) Pré‑requisitos

- Node 18+ (recomendado 20+)
- Conta no Spotify e um App criado em Spotify Developer Dashboard
- Client ID do app Spotify

Opcional (para HTTPS local/PWA/HMR):
- mkcert (ou túnel HTTPS tipo ngrok/cloudflared)

---

## 2) Criar App no Spotify e configurar Redirect URI

1. Acesse o Dashboard: https://developer.spotify.com/dashboard
2. Crie um App e copie o `Client ID`.
3. Em “Edit Settings” adicione a `Redirect URI` que usará localmente e/ou em produção.
   - Desenvolvimento (HTTP): `http://localhost:5173/callback`
   - Desenvolvimento (HTTPS): `https://localhost:5173/callback`
   - Produção (Vercel): `https://SEU_PROJETO.vercel.app/callback`
4. Scopes utilizados:
   - `user-read-private`, `user-read-email` (Perfil)
   - `user-top-read` (Top Artistas)
   - `playlist-read-private` (Minhas Playlists)
   - `playlist-modify-public` e `playlist-modify-private` (Criar playlist)

Importante: a `redirect_uri` precisa bater 1:1 com a cadastrada no dashboard (esquema/host/porta/caminho).

---

## 3) Variáveis de ambiente (.env)

Crie um arquivo `.env` na raiz:

```
VITE_SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_APP_URL=http://localhost:5173

# Opcional: ajuste do HMR quando rodar em HTTPS local ou túnel
# VITE_DEV_HTTPS=true
# HMR_PROTOCOL=wss
# HMR_HOST=seu-subdominio.ngrok-free.app
# HMR_CLIENT_PORT=443
```

Para produção (Vercel), configure as mesmas variáveis em Project Settings → Environment Variables.

---

## 4) Instalação e execução

Instalar dependências:
```
npm install
# ou
yarn
```

Ambiente de desenvolvimento:
```
npm run dev
# ou
yarn dev
```

Build de produção:
```
npm run build
```

Pré‑visualização do build:
```
npm run preview
```

Lint e formatação:
```
npm run lint
npm run format
```

Testes (base configurada):
```
npm run test
```

---

## 5) HTTPS local (recomendado para PWA e login)

Opção A — mkcert:
1. `brew install mkcert nss` e `mkcert -install`
2. `mkcert localhost 127.0.0.1 ::1`
3. No `.env`, defina `VITE_DEV_HTTPS=true`
4. Rode `npm run dev` e acesse `https://localhost:5173`

Opção B — túnel (ngrok/cloudflared):
1. Publique `http://localhost:5173` por HTTPS
2. Ajuste `.env` para usar a URL do túnel em `VITE_APP_URL` e `VITE_REDIRECT_URI`
3. (Opcional) Ajuste HMR: `HMR_PROTOCOL=wss`, `HMR_HOST=seu-dominio`, `HMR_CLIENT_PORT=443`
4. Acesse pela URL do túnel

---

## 6) PWA (instalação)

- Manifesto: `public/manifest.webmanifest`
- Service Worker: `public/sw.js` (cache simples, atualização e limpeza de caches antigos)
- Botão “Instalar PWA” já está disponível na sidebar, usando o evento `beforeinstallprompt`
- Requisitos do navegador: servir via HTTPS e aguardar a ativação do SW (1–2s)

---

## 7) Deploy (Vercel)

Incluído `vercel.json` com:
- Build estático via `@vercel/static-build` (output `dist`)
- SPA fallback: todas as rotas reescrevem para `index.html`
- Exposição de `sw.js`, `manifest.webmanifest` e `assets/*`

Passos:
1. Configure as variáveis de ambiente na Vercel (`VITE_SPOTIFY_CLIENT_ID`, `VITE_REDIRECT_URI`, `VITE_APP_URL`)
2. Ajuste a `redirect_uri` do app no Spotify para apontar para `https://SEU_PROJETO.vercel.app/callback`
3. Faça o deploy (push no Git ou Vercel CLI)

---

## 8) Fluxo de autenticação (PKCE)

1. Usuário acessa `/login`
2. Geramos `code_verifier` e `code_challenge` (S256)
3. Redirecionamos para o `authorize` com `code_challenge` e `scopes`
4. Spotify redireciona para `/callback?code=...&state=...`
5. Trocamos `code` por `access_token` usando `code_verifier`
6. Salvamos `auth_state` com `access_token`, `refresh_token`, `expiresAt`
7. `apiFetch` renova o token automaticamente ao obter 401

---

## 9) Arquitetura e escolhas técnicas

- **Vite + React + TypeScript**
  - Inicialização rápida, DX excelente e bundling moderno
- **React Router (SPA)**
  - Rotas protegidas com `RequireAuth`; fallback SPA no Vercel para evitar 404
- **Gerência de dados com TanStack Query (React Query)**
  - Cache, revalidação, paginação infinita e estados de loading/erro padronizados
  - Hooks específicos de domínio: `useTopArtists`, `useArtist`, `useArtistAlbumsInfinite`, `useUserPlaylistsInfinite`
- **Validação com Zod**
  - Schemas para respostas da API (tolerantes a campos nulos como `images: null`)
- **Autenticação OAuth 2.0 PKCE**
  - Utilitários PKCE (S256), fluxo seguro no browser
  - `apiFetch` aplica o token automaticamente e faz refresh em 401
  - Persistência simples em `localStorage` (pode ser evoluída para IndexedDB)
- **UI/UX**
  - **TailwindCSS** com layout minimalista inspirado no Spotify (sidebar fixa, área principal preta)
  - Ícones inline leves
  - Skeletons e mensagens de erro consistentes
- **PWA**
  - Manifest + Service Worker básicos para instalação e cache estático
  - Botão “Instalar PWA” expõe o prompt nativo quando disponível
- **Qualidade**
  - ESLint + Prettier + Husky (pre-commit com lint-staged)
  - Vitest + React Testing Library (base pronta para testes)

Padrões adotados:
- Separação por `features/` (auth, artists, playlists, user) e `shared/` (api, components, lib, workers)
- Hooks de dados por recurso, encapsulando chamadas/validações
- UI declarativa, sem CSS global pesado
- Tratamento de `images` e campos opcionais com Zod e checagem segura no JSX

---

## 10) Estrutura de pastas (resumo)

```
src/
 ├─ app/                 # Rotas e layout principal
 ├─ features/
 │   ├─ auth/            # Login, logout, fluxo PKCE
 │   ├─ artists/         # Top artistas e detalhes (álbuns com infinite scroll)
 │   ├─ playlists/       # Listar/criar playlists
 │   └─ user/            # Perfil do usuário (GET /me)
 └─ shared/
     ├─ api/             # apiFetch (refresh automático), endpoints utilitários
     ├─ components/      # UI reusável (Button, Modal, Icons)
     ├─ hooks/           # hooks genéricos (PWA install)
     ├─ lib/             # pkce, formatadores, utilitários
     └─ workers/         # registro do Service Worker
```

---

## 11) Solução de problemas (FAQ)

- “WebSocket/HMR falhou em HTTPS”
  - Defina no `.env`: `VITE_DEV_HTTPS=true` (mkcert) ou use túnel e configure `HMR_PROTOCOL=wss`, `HMR_HOST`, `HMR_CLIENT_PORT=443`.
- “401 após F5”
  - O `apiFetch` renova o token em 401 usando `refresh_token`. Se falhar, o app limpa o estado e redireciona para `/login`.
- “404 no Vercel ao acessar rotas diretas”
  - O `vercel.json` já tem fallback para `index.html`. Refaça o deploy e confirme.

---

## 12) Scripts úteis

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção em `dist/`
- `npm run preview` — servir o build localmente
- `npm run lint` — checar lint
- `npm run format` — formatar com Prettier
- `npm run test` — executar testes (Vitest + jsdom)

