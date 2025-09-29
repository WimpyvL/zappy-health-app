import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient, clearApiAuthToken, setApiAuthToken } from '../lib/apiClient'
import { getAuthConfig } from '../lib/auth-config'
import { profileService, patientService, type Profile } from '../services/database'

type AuthError = { message: string }

type AuthUserMetadata = Record<string, unknown>

export interface AuthUser {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  metadata?: AuthUserMetadata
  [key: string]: unknown
}

export interface AuthSession {
  accessToken: string
  refreshToken?: string | null
  expiresAt?: string | null
  user: AuthUser
}

interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  signUp: (
    email: string,
    password: string,
    options?: { data?: AuthUserMetadata }
  ) => Promise<{ error: AuthError | null }>
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

interface SessionPayload {
  user: AuthUser
  session?: {
    accessToken: string
    refreshToken?: string | null
    expiresAt?: string | null
  }
  accessToken?: string
  refreshToken?: string | null
  expiresAt?: string | null
}

const ACCESS_TOKEN_KEY = 'api_access_token'
const REFRESH_TOKEN_KEY = 'api_refresh_token'

const extractSession = (payload: SessionPayload | null | undefined): AuthSession | null => {
  if (!payload) return null
  const accessToken = payload.session?.accessToken ?? payload.accessToken
  if (!accessToken) {
    return null
  }
  return {
    accessToken,
    refreshToken: payload.session?.refreshToken ?? payload.refreshToken ?? null,
    expiresAt: payload.session?.expiresAt ?? payload.expiresAt ?? null,
    user: payload.user,
  }
}

const persistSession = (session: AuthSession | null) => {
  if (typeof window === 'undefined') return

  if (session) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
    if (session.refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
    setApiAuthToken(session.accessToken)
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    clearApiAuthToken()
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const loadProfile = async (userId: string) => {
    setProfileLoading(true)
    try {
      const profileData = await profileService.getProfile(userId)

      if (profileData) {
        setProfile(profileData)
      } else {
        const newProfile: Partial<Profile> & Pick<Profile, 'id' | 'email'> = {
          id: userId,
          email: user?.email || '',
          full_name: user?.full_name ?? null,
          avatar_url: user?.avatar_url ?? null,
        }

        const success = await profileService.createProfile(newProfile)
        if (success) {
          setProfile({ ...newProfile })
        }
      }

      const patientData = await patientService.getPatient(userId)
      if (!patientData) {
        console.log('No patient record found, creating one for existing user')
        const metadataName = typeof user?.metadata?.full_name === 'string' ? user.metadata.full_name : ''
        const fullName = (metadataName as string) || user?.full_name || ''
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

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

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

  const handleNewUserRegistration = async (userId: string, userEmail: string, userMetadata?: AuthUserMetadata) => {
    try {
      console.log('Handling new user registration for:', userEmail)

      const newProfile: Partial<Profile> & Pick<Profile, 'id' | 'email'> = {
        id: userId,
        email: userEmail,
        full_name: typeof userMetadata?.full_name === 'string' ? (userMetadata.full_name as string) : null,
        avatar_url: null,
      }

      const profileCreated = await profileService.createProfile(newProfile)
      if (profileCreated) {
        setProfile({ ...newProfile })
        console.log('Profile created successfully')
      } else {
        console.error('Failed to create profile')
      }

      const fullName = typeof userMetadata?.full_name === 'string' ? (userMetadata.full_name as string) : ''
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

  const bootstrapSession = async () => {
    setLoading(true)
    try {
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      const storedToken = window.localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!storedToken) {
        setLoading(false)
        return
      }

      setApiAuthToken(storedToken)
      try {
        const sessionResponse = await apiClient.get<SessionPayload>('auth/session')
        const extracted = extractSession(sessionResponse)
        if (extracted) {
          setSession(extracted)
          setUser(extracted.user)
          persistSession(extracted)
          await loadProfile(extracted.user.id)
        } else {
          persistSession(null)
        }
      } catch (error) {
        console.error('Error restoring session:', error)
        persistSession(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    bootstrapSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp: AuthContextType['signUp'] = async (email, password, options) => {
    try {
      const response = await apiClient.post<SessionPayload>('auth/register', {
        email,
        password,
        metadata: options?.data,
      }, { skipAuth: true })

      const extracted = extractSession(response)
      if (extracted) {
        setSession(extracted)
        setUser(extracted.user)
        persistSession(extracted)
        await handleNewUserRegistration(extracted.user.id, email, options?.data)
        await loadProfile(extracted.user.id)
      }

      return { error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: { message: (error as Error).message } }
    }
  }

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    try {
      const response = await apiClient.post<SessionPayload>('auth/login', {
        email,
        password,
      }, { skipAuth: true })

      const extracted = extractSession(response)
      if (extracted) {
        setSession(extracted)
        setUser(extracted.user)
        persistSession(extracted)
        await loadProfile(extracted.user.id)
      }

      return { error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: { message: (error as Error).message } }
    }
  }

  const signInWithGoogle: AuthContextType['signInWithGoogle'] = async () => {
    try {
      const authConfig = getAuthConfig()
      const response = await apiClient.post<{ url: string }>('auth/oauth/google', {
        redirectTo: authConfig.redirectUrl,
      }, { skipAuth: true })

      if (response?.url) {
        window.location.href = response.url
      }

      return { error: null }
    } catch (error) {
      console.error('Error initiating Google sign-in:', error)
      return { error: { message: (error as Error).message } }
    }
  }

  const signOut: AuthContextType['signOut'] = async () => {
    try {
      await apiClient.post('auth/logout')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setUser(null)
      setSession(null)
      setProfile(null)
      persistSession(null)
    }

    return { error: null }
  }

  const resetPassword: AuthContextType['resetPassword'] = async (email) => {
    try {
      await apiClient.post('auth/reset-password', { email }, { skipAuth: true })
      return { error: null }
    } catch (error) {
      console.error('Error requesting password reset:', error)
      return { error: { message: (error as Error).message } }
    }
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
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
