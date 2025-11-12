import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'
import { TopArtistsResponseSchema, SpotifyArtist } from '../schemas'
import { apiFetch } from '@shared/api/client'

export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

async function fetchTopArtists(
  token: string,
  timeRange: TimeRange,
  limit: number
): Promise<SpotifyArtist[]> {
  const params = new URLSearchParams()
  params.set('time_range', timeRange)
  params.set('limit', String(limit))
  const res = await apiFetch(`https://api.spotify.com/v1/me/top/artists?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao buscar top artistas: ${res.status} ${text}`)
  }
  const json = await res.json()
  const parsed = TopArtistsResponseSchema.parse(json)
  return parsed.items
}

export function useTopArtists({
  timeRange = 'medium_term',
  limit = 20
}: {
  timeRange?: TimeRange
  limit?: number
} = {}) {
  const { auth } = useAuth()
  const token = auth.accessToken
  return useQuery({
    queryKey: ['top-artists', token, timeRange, limit],
    queryFn: () => fetchTopArtists(token!, timeRange, limit),
    enabled: Boolean(token),
    staleTime: 60_000
  })
}


