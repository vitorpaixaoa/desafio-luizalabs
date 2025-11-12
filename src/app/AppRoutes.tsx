import { Route, Routes, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from '@features/auth/pages/Login'
import CallbackPage from '@features/auth/pages/Callback'
import RequireAuth from './guards/RequireAuth'

function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-neutral-300">Selecione uma aba para começar.</p>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="artists" element={<div className="p-6">Artistas</div>} />
        <Route path="albums" element={<div className="p-6">Álbuns</div>} />
        <Route path="playlists" element={<div className="p-6">Playlists</div>} />
        <Route path="account" element={<div className="p-6">Conta</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
     
      </Route>
    </Routes>
  )
}


