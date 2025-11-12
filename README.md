# Desafio Magalu — Spotify (Vite + React + TS)

Aplicativo React com autenticação via Spotify (OAuth 2.0 PKCE), React Query, Tailwind e suporte inicial a offline. Baseado no arquivo `docs/IMPLEMENTATION_TODO.md`.

## Scripts

- `yarn dev` — Ambiente de desenvolvimento
- `yarn build` — Build de produção
- `yarn preview` — Servir build localmente
- `yarn lint` — Lint
- `yarn format` — Prettier
- `yarn test` — Testes (Vitest + jsdom)

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com:

```
VITE_SPOTIFY_CLIENT_ID=xxxx
VITE_REDIRECT_URI=http://localhost:5173/callback
VITE_APP_URL=http://localhost:5173
```

## Fluxo de autenticação (PKCE)

1. Usuário clica em “Entrar com Spotify” (`/login`)
2. Geramos `code_verifier` e `code_challenge` (S256)
3. Redirecionamos ao `authorize` com `code_challenge`
4. Spotify redireciona para `/callback?code=...&state=...`
5. Trocamos `code` por `access_token` usando `code_verifier`

## Estrutura

Consulte `docs/IMPLEMENTATION_TODO.md` para a estrutura alvo. Este repositório já contém:

- Rotas base com `react-router-dom`
- Telas de `Login` e `Callback`
- `AuthProvider` simples (localStorage)
- Registro de Service Worker básico (`public/sw.js`)

## Rodando localmente

1. `yarn` para instalar dependências
2. Configure `.env`
3. `yarn dev`

## Próximos passos

- Implementar camadas de dados (Zod + React Query)
- Listas de artistas, álbuns, playlists
- IndexedDB e Workbox avançado (fila offline para POST)
- Testes unitários dos hooks e componentes


