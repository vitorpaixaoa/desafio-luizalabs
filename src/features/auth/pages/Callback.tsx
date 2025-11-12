import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { exchangeCodeForToken } from '@shared/api/spotify'
import { useAuth } from '@shared/stores/authStore'

export default function CallbackPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(search)
    const code = params.get('code')
    const state = params.get('state')
    const storedState = sessionStorage.getItem('auth_state')
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')

    async function run() {
      try {
        if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
          throw new Error('Parâmetros de autenticação inválidos.')
        }
        const tokens = await exchangeCodeForToken(code, codeVerifier)
        const expiresAt = Date.now() + tokens.expires_in * 1000 - 5000
        setAuth({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt,
          scope: tokens.scope
        })
        sessionStorage.removeItem('auth_state')
        sessionStorage.removeItem('pkce_code_verifier')
        navigate('/', { replace: true })
      } catch (e: unknown) {
        setError((e as Error).message)
      }
    }
    void run()
  }, [navigate, search, setAuth])

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-semibold">Erro de autenticação</h2>
          <p className="text-neutral-300">{error}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <p className="text-neutral-300">Processando login...</p>
    </div>
  )
}


