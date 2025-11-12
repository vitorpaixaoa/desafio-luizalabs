import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@shared/stores/authStore'
import { PlaylistsResponseSchema } from '../schemas'

type CreatePayload = {
  userId: string
  name: string
  description?: string
  isPublic?: boolean
}

async function createPlaylistRequest(token: string, payload: CreatePayload) {
  const body = {
    name: payload.name,
    description: payload.description ?? '',
    public: payload.isPublic ?? true
  }
  const res = await fetch(`https://api.spotify.com/v1/users/${payload.userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao criar playlist: ${res.status} ${text}`)
  }
  return await res.json()
}

export function useCreatePlaylist() {
  const { auth } = useAuth()
  const token = auth.accessToken
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePayload) => createPlaylistRequest(token!, payload),
    onSuccess: (created) => {
      // Atualiza otimistamente a primeira página das playlists, colocando a nova no topo
      queryClient.setQueriesData(
        { queryKey: ['user-playlists'] },
        (oldData: InfiniteData<ReturnType<typeof PlaylistsResponseSchema.parse>> | undefined) => {
          if (!oldData) return oldData
          const simplified = {
            id: created.id as string,
            name: created.name as string,
            images: (created.images ?? null) as unknown,
            owner: { display_name: created?.owner?.display_name ?? null },
            tracks: { total: created?.tracks?.total ?? 0 }
          }
          return {
            ...oldData,
            pages: oldData.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    items: [simplified as any, ...page.items],
                    total: (page.total ?? 0) + 1
                  }
                : page
            )
          }
        }
      )
      // Também invalida para garantir sincronização com backend
      void queryClient.invalidateQueries({ queryKey: ['user-playlists'] })
    }
  })
}


