const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string
const APP_URL = import.meta.env.VITE_APP_URL as string

export function buildAuthorizeUrl(params: {
  codeChallenge: string
  state: string
  scope?: string
}): string {
  const url = new URL(SPOTIFY_AUTHORIZE_URL)
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('code_challenge', params.codeChallenge)
  url.searchParams.set(
    'scope',
    params.scope ??
      [
        'user-read-email',
        'user-read-private',
        'user-top-read',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
      ].join(' ')
  )
  url.searchParams.set('state', params.state)
  return url.toString()
}

export type TokenResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token?: string
  scope: string
}

export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
  const form = new URLSearchParams()
  form.set('client_id', CLIENT_ID)
  form.set('grant_type', 'authorization_code')
  form.set('code', code)
  form.set('redirect_uri', REDIRECT_URI)
  form.set('code_verifier', codeVerifier)

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form.toString()
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erro ao obter token: ${res.status} ${text}`)
  }
  return (await res.json()) as TokenResponse
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const form = new URLSearchParams()
  form.set('client_id', CLIENT_ID)
  form.set('grant_type', 'refresh_token')
  form.set('refresh_token', refreshToken)

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erro ao renovar token: ${res.status} ${text}`)
  }
  return (await res.json()) as TokenResponse
}

export function getAppUrl(): string {
  return APP_URL || window.location.origin
}


