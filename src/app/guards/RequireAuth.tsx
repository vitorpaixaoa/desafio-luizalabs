import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@shared/stores/authStore'

type Props = {
  children: ReactNode
}

export default function RequireAuth({ children }: Props) {
  const { auth } = useAuth()
  const location = useLocation()

  const isValid =
    Boolean(auth.accessToken) &&
    (typeof auth.expiresAt !== 'number' || Date.now() < Number(auth.expiresAt))

  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}


