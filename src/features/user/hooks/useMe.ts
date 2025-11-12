import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'

export type SpotifyUser = {
  id: string
  display_name: string | null
  images?: Array<{ url: string }>
  email?: string
  product?: string
}

async function fetchMe(token: string): Promise<SpotifyUser> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao buscar perfil: ${res.status} ${text}`)
  }
  return (await res.json()) as SpotifyUser
}

export function useMe() {
  const { auth } = useAuth()
  const accessToken = auth.accessToken
  return useQuery({
    queryKey: ['me', accessToken],
    queryFn: () => fetchMe(accessToken!),
    enabled: Boolean(accessToken),
    staleTime: 60_000
  })
}



