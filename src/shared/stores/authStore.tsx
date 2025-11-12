import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type AuthState = {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  scope?: string
}

type AuthContextValue = {
  auth: AuthState
  setAuth: (next: AuthState) => void
  clear: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(() => {
    const raw = localStorage.getItem('auth_state')
    return raw ? (JSON.parse(raw) as AuthState) : {}
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      setAuth: (next) => {
        setAuthState(next)
        localStorage.setItem('auth_state', JSON.stringify(next))
      },
      clear: () => {
        setAuthState({})
        localStorage.removeItem('auth_state')
      }
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}


