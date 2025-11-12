import { refreshAccessToken } from './spotify'

type FetchOptions = RequestInit & {
  retryOn401?: boolean
}

function readAuthState():
  | { accessToken?: string; refreshToken?: string; expiresAt?: number; scope?: string }
  | undefined {
  try {
    const raw = localStorage.getItem('auth_state')
    return raw ? (JSON.parse(raw) as any) : undefined
  } catch {
    return undefined
  }
}

function writeAuthState(next: any) {
  try {
    localStorage.setItem('auth_state', JSON.stringify(next))
  } catch {
    // ignore
  }
}

export async function apiFetch(
  input: string,
  init: FetchOptions = {},
  didRetry = false
): Promise<Response> {
  const state = readAuthState()
  const headers = new Headers(init.headers || {})
  if (state?.accessToken) {
    headers.set('Authorization', `Bearer ${state.accessToken}`)
  }

  const res = await fetch(input, { ...init, headers })
  if (res.status !== 401) {
    return res
  }

  // Tentativa de refresh simples (uma vez)
  if (didRetry) return res

  if (state?.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(state.refreshToken)
      const nextState = {
        ...state,
        accessToken: refreshed.access_token,
        expiresAt: Date.now() + refreshed.expires_in * 1000 - 5000,
        refreshToken: refreshed.refresh_token ?? state.refreshToken,
        scope: refreshed.scope ?? state.scope
      }
      writeAuthState(nextState)
      const retryHeaders = new Headers(init.headers || {})
      retryHeaders.set('Authorization', `Bearer ${nextState.accessToken}`)
      return await apiFetch(input, { ...init, headers: retryHeaders }, true)
    } catch {
      // falhou refresh
    }
  }

  // limpar e redirecionar
  localStorage.removeItem('auth_state')
  if (typeof window !== 'undefined') {
    window.location.assign('/login')
  }
  return res
}


