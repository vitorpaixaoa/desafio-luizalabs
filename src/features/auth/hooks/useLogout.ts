import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'

export function useLogout() {
  const { clear } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    // Limpa cache de dados e estado de auth
    queryClient.clear()
    clear()

    // Remove resíduos do fluxo PKCE (se houver)
    sessionStorage.removeItem('auth_state')
    sessionStorage.removeItem('pkce_code_verifier')

    // Redireciona para login
    navigate('/login', { replace: true })
  }
}


