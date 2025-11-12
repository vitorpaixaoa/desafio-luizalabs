import { z } from 'zod'

export const ImageSchema = z.object({
  url: z.string().url(),
  height: z.number().nullable().optional(),
  width: z.number().nullable().optional()
})

export const SimplifiedPlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(ImageSchema).nullable().optional(),
  owner: z
    .object({
      display_name: z.string().nullable().optional()
    })
    .optional(),
  tracks: z.object({
    total: z.number()
  })
})

export const PlaylistsResponseSchema = z.object({
  items: z.array(SimplifiedPlaylistSchema).nullable().optional(),
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable()
})

export type SimplifiedPlaylist = z.infer<typeof SimplifiedPlaylistSchema>


