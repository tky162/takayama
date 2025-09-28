export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface AdminSession {
  id: string
  user_id: string
  ip_address?: string
  user_agent?: string
  created_at: string
  last_activity: string
  is_active: boolean
}

import { User, Session } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
}
