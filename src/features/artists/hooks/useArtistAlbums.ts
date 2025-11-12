import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'
import { z } from 'zod'
import { apiFetch } from '@shared/api/client'

export const SimplifiedAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z
    .array(
    z.object({
      url: z.string().url(),
      height: z.number().nullable().optional(),
      width: z.number().nullable().optional()
    })
  ).nullable(),
  release_date: z.string(),
  release_date_precision: z.enum(['year', 'month', 'day']),
  album_type: z.enum(['album', 'single', 'compilation'])
})

const AlbumsResponseSchema = z.object({
  items: z.array(SimplifiedAlbumSchema).nullable().optional(),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable()
})

export type SimplifiedAlbum = z.infer<typeof SimplifiedAlbumSchema>

async function fetchArtistAlbums(
  token: string,
  artistId: string,
  includeGroups: string,
  limit: number
) {
  const params = new URLSearchParams()
  params.set('include_groups', includeGroups)
  params.set('limit', String(limit))
  const res = await apiFetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?${params.toString()}`
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao buscar álbuns: ${res.status} ${text}`)
  }
  const json = await res.json()
  return AlbumsResponseSchema.parse(json)
}

export function useArtistAlbums(artistId?: string, includeGroups = 'album,single', limit = 20) {
  const { auth } = useAuth()
  const token = auth.accessToken
  return useQuery({
    queryKey: ['artist-albums', artistId, includeGroups, limit, token],
    queryFn: () => fetchArtistAlbums(token!, artistId!, includeGroups, limit),
    enabled: Boolean(token && artistId),
    staleTime: 60_000
  })
}


