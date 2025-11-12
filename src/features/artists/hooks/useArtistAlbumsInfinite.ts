import { useInfiniteQuery } from '@tanstack/react-query'
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

type AlbumsResponse = z.infer<typeof AlbumsResponseSchema>

async function fetchArtistAlbumsPage(
  token: string,
  artistId: string,
  includeGroups: string,
  limit: number,
  offset: number
): Promise<AlbumsResponse> {
  const params = new URLSearchParams()
  params.set('include_groups', includeGroups)
  params.set('limit', String(limit))
  params.set('offset', String(offset))
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

export function useArtistAlbumsInfinite(
  artistId?: string,
  includeGroups = 'album,single',
  limit = 20
) {
  const { auth } = useAuth()
  const token = auth.accessToken

  return useInfiniteQuery({
    queryKey: ['artist-albums-infinite', artistId, includeGroups, limit, token],
    enabled: Boolean(token && artistId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchArtistAlbumsPage(token!, artistId!, includeGroups, limit, pageParam as number),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit
      if (nextOffset >= lastPage.total || !lastPage.next) return undefined
      return nextOffset
    },
    staleTime: 60_000
  })
}


