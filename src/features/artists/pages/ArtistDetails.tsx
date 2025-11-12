import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useArtist } from '../hooks/useArtist'
import { useArtistAlbumsInfinite } from '../hooks/useArtistAlbumsInfinite'
import { formatIsoDateToBR } from '@shared/lib/date'
import { useEffect, useRef } from 'react'

export default function ArtistDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { state } = useLocation() as { state?: { name?: string } }
  const navigate = useNavigate()

  const { data: artist } = useArtist(id)
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useArtistAlbumsInfinite(id, 'album,single', 20)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const items = data?.pages.flatMap((p) => p.items) ?? []

  const title = artist?.name ?? state?.name ?? 'Artista'

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px 0px 0px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="min-h-full text-white">
      <div className="px-8 py-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"
          aria-label="Voltar"
        >
          <span className="text-lg">{'←'}</span>
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="px-8">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white/10 rounded-md animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && <div className="text-red-400 text-sm">{(error as Error)?.message}</div>}

        <div className="grid gap-6">
          {items.map((album) => (
            <div key={album.id} className="flex items-center gap-4">
              <img
                src={album.images?.[0]?.url}
                alt={album.name}
                className="h-16 w-16 rounded-md object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-sm">{album.name}</span>
                <span className="text-xs text-white/60">{formatIsoDateToBR(album.release_date)}</span>
              </div>
            </div>
          ))}
          {/* Sentinel para Infinite Scroll */}
          <div ref={sentinelRef} />
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="justify-self-start text-xs text-white/70 underline underline-offset-4"
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


