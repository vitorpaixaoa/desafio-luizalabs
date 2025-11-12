import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TimeRange, useTopArtists } from '../hooks/useTopArtists'

export default function ArtistsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term')
  const { data, isLoading, isError, error } = useTopArtists({ timeRange, limit: 20 })

  return (
    <div className="min-h-full text-white">
      <div className="max-w-3xl px-8 py-10">
        <h1 className="text-2xl font-semibold">Top Artistas</h1>
        <p className="text-white/70 mt-2">
          Aqui você encontra seus artistas preferidos
        </p>

        {/* Filtro de período */}
        <div className="mt-6 inline-flex rounded-md bg-white/5 p-1">
          {[
            { key: 'short_term', label: '4 semanas' },
            { key: 'medium_term', label: '6 meses' },
            { key: 'long_term', label: '1 ano' }
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeRange(opt.key as TimeRange)}
              className={[
                'px-3 py-1 text-xs rounded-md transition-colors',
                timeRange === (opt.key as TimeRange) ? 'bg-white text-black' : 'text-white/70'
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-sm text-red-400">
              {(error as Error)?.message ?? 'Erro ao carregar artistas.'}
            </div>
          )}

          {data?.map((artist) => (
            <Link
              to={`/artists/${artist.id}`}
              state={{ name: artist.name }}
              key={artist.id}
              className="flex items-center gap-4 group"
            >
              {artist.images?.[0]?.url ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="h-12 w-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10 grid place-items-center">
                  <span className="text-xs text-white/70">
                    {artist.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm group-hover:underline">{artist.name}</span>
                {artist.genres && artist.genres.length > 0 && (
                  <span className="text-xs text-white/50 truncate max-w-[240px]">
                    {artist.genres.slice(0, 2).join(' • ')}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


