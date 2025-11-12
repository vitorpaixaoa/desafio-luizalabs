import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'
import { z } from 'zod'

const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        height: z.number().nullable().optional(),
        width: z.number().nullable().optional()
      })
    )
    .optional()
})

export type Artist = z.infer<typeof ArtistSchema>

async function fetchArtist(token: string, id: string): Promise<Artist> {
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao buscar artista: ${res.status} ${text}`)
  }
  const json = await res.json()
  return ArtistSchema.parse(json)
}

export function useArtist(id?: string) {
  const { auth } = useAuth()
  const token = auth.accessToken
  return useQuery({
    queryKey: ['artist', id, token],
    queryFn: () => fetchArtist(token!, id!),
    enabled: Boolean(token && id)
  })
}


