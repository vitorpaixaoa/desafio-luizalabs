import Button from '@shared/components/Button'
import Modal from '@shared/components/Modal'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUserPlaylistsInfinite } from '../hooks/useUserPlaylistsInfinite'
import { useMe } from '@features/user/hooks/useMe'
import { useCreatePlaylist } from '../hooks/useCreatePlaylist'

export default function PlaylistsPage() {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useUserPlaylistsInfinite(20)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const items = data?.pages.flatMap((p) => p.items) ?? []
  const { data: me } = useMe()

  // Modal
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const defaultName = useMemo(() => `Minha playlist #${(items?.length ?? 0) + 1}`, [items?.length])
  const { mutateAsync: createPlaylist, isPending: creating, error: createError } = useCreatePlaylist()

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="min-h-full text-white">
      <div className="px-8 py-10 max-w-3xl">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Minhas Playlists</h1>
            <p className="text-white/70 mt-2">Sua coleção pessoal de playlists</p>
          </div>
          <Button className="px-5 py-2 rounded-full" onClick={() => {
            setName(defaultName)
            setOpen(true)
          }}>
            Criar playlist
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-white/10 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && <div className="text-sm text-red-400">{(error as Error)?.message}</div>}

          { items && items?.map((pl: any) => (
            <div key={pl.id} className="flex items-center gap-4">
              {pl.images?.[0]?.url ? (
                <img
                  src={pl.images[0].url}
                  alt={pl.name}
                  className="h-16 w-16 rounded-md object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-16 w-16 rounded-md bg-white/10" />
              )}
              <div className="flex flex-col">
                <span className="text-sm">{pl.name}</span>
                <span className="text-xs text-white/60">
                  {pl.owner?.display_name ?? 'Sem Etiqueta'}
                </span>
              </div>
            </div>
          ))}

          <div ref={sentinelRef} />
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs text-white/70 underline underline-offset-4"
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </div>
      </div>

      {/* Modal de criação */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-white/80">Dê um nome a sua playlist</div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full grid place-items-center text-white/80 hover:text-white"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={defaultName}
            className="w-full bg-transparent text-xl font-semibold outline-none border-b border-white/20 focus:border-white/40 pb-2"
          />
          {createError && (
            <div className="mt-3 text-xs text-red-400">{(createError as Error).message}</div>
          )}
          <div className="mt-8 flex justify-center">
            <Button
              disabled={!name || creating || !me?.id}
              onClick={async () => {
                if (!me?.id) return
                const finalName = name.trim() || defaultName
                await createPlaylist({ userId: me.id, name: finalName, isPublic: true })
                setOpen(false)
              }}
              className="px-6 py-2 rounded-full"
            >
              {creating ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


