import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getAuthConfig } from '../lib/auth-config'
import { profileService, patientService } from '../services/database'
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

      // Also check if patient record exists, create if not
      const patientData = await patientService.getPatient(userId)
      if (!patientData) {
        console.log('No patient record found, creating one for existing user')
        // Extract first name from full name or user metadata
        const fullName = user?.user_metadata?.full_name || profileData?.full_name || ''
        const firstName = fullName.split(' ')[0] || 'Patient'
        const lastName = fullName.split(' ').slice(1).join(' ') || ''

        const newPatient = {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: user?.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const patientCreated = await patientService.createPatient(newPatient)
        if (patientCreated) {
          console.log('Patient record created for existing user:', firstName, lastName)
        } else {
          console.error('Failed to create patient record for existing user')
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

  // Function to handle new user registration (ensures both profile and patient are created)
  const handleNewUserRegistration = async (userId: string, userEmail: string, userMetadata?: any) => {
    try {
      console.log('Handling new user registration for:', userEmail)
      
      // Create profile
      const newProfile = {
        id: userId,
        email: userEmail,
        full_name: userMetadata?.full_name || '',
        avatar_url: null,
      }
      
      const profileCreated = await profileService.createProfile(newProfile)
      if (profileCreated) {
        setProfile(newProfile as Profile)
        console.log('Profile created successfully')
      } else {
        console.error('Failed to create profile')
      }

      // Create patient record
      const fullName = userMetadata?.full_name || ''
      const firstName = fullName.split(' ')[0] || 'Patient'
      const lastName = fullName.split(' ').slice(1).join(' ') || ''

      const newPatient = {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const patientCreated = await patientService.createPatient(newPatient)
      if (patientCreated) {
        console.log('Patient record created successfully:', firstName, lastName)
      } else {
        console.error('Failed to create patient record')
      }
    } catch (error) {
      console.error('Error during new user registration:', error)
    }
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
      
      // Handle different auth events
      if (session?.user) {
        if (event === 'SIGNED_IN') {
          // Check if this is a new user by looking for existing profile
          const existingProfile = await profileService.getProfile(session.user.id)
          if (!existingProfile) {
            // New user registration - create both profile and patient
            await handleNewUserRegistration(
              session.user.id, 
              session.user.email || '', 
              session.user.user_metadata
            )
          } else {
            // Existing user sign in - load existing profile and ensure patient exists
            await loadProfile(session.user.id)
          }
        }
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