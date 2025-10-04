'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './hooks'
import { AuthContextType } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}): React.JSX.Element {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
