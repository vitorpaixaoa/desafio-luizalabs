import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'
import { PlaylistsResponseSchema } from '../schemas'

async function fetchPlaylistsPage(token: string, limit: number, offset: number) {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  const res = await fetch(`https://api.spotify.com/v1/me/playlists?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao buscar playlists: ${res.status} ${text}`)
  }
  const json = await res.json()
  return PlaylistsResponseSchema.parse(json)
}

export function useUserPlaylistsInfinite(limit = 20) {
  const { auth } = useAuth()
  const token = auth.accessToken
  return useInfiniteQuery({
    queryKey: ['user-playlists', token, limit],
    enabled: Boolean(token),
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPlaylistsPage(token!, limit, pageParam as number),
    getNextPageParam: (last) => {
      const nextOffset = last.offset + last.limit
      if (nextOffset >= last.total || !last.next) return undefined
      return nextOffset
    },
    staleTime: 60_000
  })
}


