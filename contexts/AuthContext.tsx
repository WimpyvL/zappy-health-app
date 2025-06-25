import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getAuthConfig } from '../lib/auth-config'
import { profileService } from '../services/database'
import type { Database } from '../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Function to fetch and set profile data
  const loadProfile = async (userId: string) => {
    setProfileLoading(true)
    try {
      const profileData = await profileService.getProfile(userId)
      
      if (profileData) {
        setProfile(profileData)
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: null,
        }
        
        const success = await profileService.createProfile(newProfile)
        if (success) {
          setProfile(newProfile as Profile)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  // Function to update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user || !profile) return false

    const success = await profileService.updateProfile(user.id, {
      ...updates,
      updated_at: new Date().toISOString()
    })

    if (success) {
      setProfile({ ...profile, ...updates })
    }

    return success
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Load profile if user is authenticated
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Load profile when user signs in, clear when user signs out
      if (session?.user && event === 'SIGNED_IN') {
        await loadProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const authConfig = getAuthConfig()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authConfig.redirectUrl,
        queryParams: {
          ...authConfig.googleOAuthOptions
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}