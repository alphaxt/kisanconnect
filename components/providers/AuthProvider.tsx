'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, session: null,
  loading: true, signOut: async () => {}, refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function fetchProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) setProfile(data)
    } catch {}
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  useEffect(() => {
    // 1. Check local session storage first
    try {
      const saved = localStorage.getItem('kisanconnect_user')
      if (saved) {
        const p = JSON.parse(saved)
        setUser({
          id: p.id,
          email: p.email,
          app_metadata: {},
          user_metadata: { full_name: p.full_name, role: p.role },
          aud: 'authenticated',
          created_at: p.created_at || new Date().toISOString(),
        } as User)
        setProfile(p)
        setLoading(false)
      }
    } catch {}

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session)
        setUser(session.user)
        fetchProfile(session.user.id)
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSession(session)
          setUser(session.user)
          fetchProfile(session.user.id)
        } else {
          const saved = localStorage.getItem('kisanconnect_user')
          if (!saved) {
            setUser(null)
            setProfile(null)
            setSession(null)
          }
        }
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  // Dynamic Theme Synchronization based on active Role
  useEffect(() => {
    const isBuyer = profile?.role === 'buyer' || user?.email?.toLowerCase().includes('danish')
    if (isBuyer) {
      document.documentElement.setAttribute('data-theme', 'buyer')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [user, profile])

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } catch {}
    try {
      localStorage.removeItem('kisanconnect_user')
      document.cookie = 'kisanconnect_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } catch {}
    document.documentElement.removeAttribute('data-theme')
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
