import { NavLink, Outlet } from 'react-router-dom'
import { useMe } from '@features/user/hooks/useMe'
import { useAuth } from '@shared/stores/authStore'
import Button from '@shared/components/Button'
import { useLogout } from '@features/auth/hooks/useLogout'
import { IconArtist, IconDownload, IconHome, IconPlaylist, IconUser } from '@shared/components/Icons'
import { usePWAInstallPrompt } from '@shared/hooks/usePWAInstallPrompt'

const tabs = [
  { to: '/', label: 'Home', icon: IconHome, end: true },
  { to: '/artists', label: 'Artistas', icon: IconArtist },
  { to: '/playlists', label: 'Playlists', icon: IconPlaylist },
  { to: '/account', label: 'Perfil', icon: IconUser }
]

export default function MainLayout() {
  const { auth } = useAuth()
  const { data: me, isLoading } = useMe()
  const logout = useLogout()
  const { canInstall, install } = usePWAInstallPrompt()

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0f0f0f] text-white flex flex-col justify-between">
        <div className="p-5 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-white text-black grid place-items-center font-black">
              ♫
            </div>
            <span className="text-xl font-semibold">Spotify</span>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-5">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end as boolean | undefined}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                      isActive ? 'text-white' : 'text-white/75 hover:text-white'
                    ].join(' ')
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer Install PWA */}
        <div className="p-5">
          <button
            onClick={canInstall ? install : undefined}
            className="flex items-center gap-3 px-3 py-2 text-sm text-white/75 hover:text-white"
          >
            <IconDownload className="h-5 w-5" />
            <span>Instalar PWA</span>
          </button>
          {/* User area / Logout */}
          {auth.accessToken && (
            <div className="mt-4 flex items-center justify-between">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-neutral-800 animate-pulse" />
              ) : me?.images?.[0]?.url ? (
                <img
                  src={me.images[0].url}
                  alt={me.display_name ?? 'Usuário'}
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-neutral-800 grid place-items-center">
                  <span className="text-xs text-neutral-300">
                    {(me?.display_name ?? 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <Button variant="secondary" className="h-8 px-3 py-2 text-xs" onClick={logout}>
                Sair
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 bg-black">
        <Outlet />
      </main>
    </div>
  )
}


