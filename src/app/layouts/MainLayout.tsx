import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function SidebarContent() {
    return (
      <>
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
      </>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#0f0f0f] text-white flex-col justify-between">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={[
          'md:hidden fixed inset-y-0 left-0 z-50 w-60 bg-[#0f0f0f] text-white flex flex-col justify-between transform transition-transform',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <SidebarContent />
      </aside>
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Content Area */}
      <main className="flex-1 bg-black">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="h-10 w-10 grid place-items-center rounded-md bg-white/10 text-white"
              aria-label="Abrir menu"
            >
              {/* ícone hambúrguer */}
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
            <span className="text-sm text-white/80">Menu</span>
            <div className="h-10 w-10" />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}


