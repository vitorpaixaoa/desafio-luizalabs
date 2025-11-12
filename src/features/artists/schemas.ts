import { z } from 'zod'

export const SpotifyImageSchema = z.object({
  url: z.string().url(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional()
})

export const SpotifyArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(SpotifyImageSchema).optional(),
  genres: z.array(z.string()).optional(),
  popularity: z.number().optional(),
  external_urls: z.object({ spotify: z.string().url() }).optional()
})

export const TopArtistsResponseSchema = z.object({
  items: z.array(SpotifyArtistSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number()
})

export type SpotifyArtist = z.infer<typeof SpotifyArtistSchema>


