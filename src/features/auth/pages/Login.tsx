import Button from '@shared/components/Button'
import { generateVerifierAndChallenge } from '@shared/lib/pkce'
import { buildAuthorizeUrl } from '@shared/api/spotify'

export default function LoginPage() {
  async function handleLogin() {
    const { codeVerifier, codeChallenge } = await generateVerifierAndChallenge()
    const state = crypto.randomUUID()
    sessionStorage.setItem('pkce_code_verifier', codeVerifier)
    sessionStorage.setItem('auth_state', state)
    const authorizeUrl = buildAuthorizeUrl({ codeChallenge, state })
    window.location.href = authorizeUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-semibold">Entrar com Spotify</h1>
        <p className="text-neutral-300">
          Para continuar, você precisa autorizar o aplicativo a acessar sua conta Spotify.
        </p>
        <Button onClick={handleLogin} className="w-full" variant="primary">
          Entrar com Spotify
        </Button>
      </div>
    </div>
  )
}


