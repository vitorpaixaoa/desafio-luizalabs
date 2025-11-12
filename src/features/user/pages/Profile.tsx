import { useMe } from '../hooks/useMe'

export default function ProfilePage() {
  const { data: me, isLoading, isError, error } = useMe()

  return (
    <div className="min-h-full text-white">
      <div className="px-8 py-10 max-w-3xl">
        <h1 className="text-2xl font-semibold">Perfil</h1>
        <p className="text-white/70 mt-2">Suas informações da conta Spotify</p>

        {isLoading && (
          <div className="mt-8 flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-white/10 animate-pulse" />
            <div className="space-y-3">
              <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        )}

        {isError && <div className="mt-6 text-sm text-red-400">{(error as Error)?.message}</div>}

        {me && (
          <div className="mt-8">
            <div className="flex items-center gap-6">
              {me.images?.[0]?.url ? (
                <img
                  src={me.images[0].url}
                  alt={me.display_name ?? 'Usuário'}
                  className="h-20 w-20 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white/10 grid place-items-center">
                  <span className="text-lg text-white/80">
                    {(me.display_name ?? 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="text-lg font-medium">{me.display_name ?? 'Usuário'}</div>
                {me.email && <div className="text-sm text-white/70">{me.email}</div>}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">Plano</div>
                <div className="mt-1 text-sm">{me.product ?? '—'}</div>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">ID</div>
                <div className="mt-1 text-sm break-all">{me.id}</div>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">Imagens</div>
                <div className="mt-1 text-sm">{me.images?.length ?? 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


