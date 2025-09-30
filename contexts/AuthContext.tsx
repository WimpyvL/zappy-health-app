import React, { createContext, useContext, useEffect, useState } from 'react'
import { databaseService } from '../services/databaseService'
import type { Profile } from '../types/api'
import {
  API_BASE_URL,
  clearAuthTokens,
  getStoredTokens,
  setAuthTokens
} from '../services/apiClient'

export interface AuthError {
  message: string
  status?: number
}

export interface AuthSession {
  accessToken: string
  refreshToken?: string | null
  expiresAt?: number | null
}

export interface AuthUser {
  id: string
  email?: string | null
  full_name?: string | null
  first_name?: string | null
  last_name?: string | null
  created_at?: string | null
  [key: string]: unknown
}

interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const apiKey = import.meta.env.VITE_ZAPPY_API_KEY || import.meta.env.VITE_API_KEY || ''
  const AUTH_BASE_URL = `${API_BASE_URL}/auth`

  const buildHeaders = (token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (apiKey) {
      headers['X-API-KEY'] = apiKey
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const parseAuthError = async (response: Response): Promise<AuthError> => {
    const body = await response.json().catch(() => ({}))
    return {
      message: body.message || body.error || response.statusText || 'Authentication failed',
      status: response.status
    }
  }

  const normalizeUser = (payload: any): AuthUser => {
    if (!payload) {
      throw new Error('Invalid user payload received from authentication service')
    }

    const id = payload.id || payload.user_id || payload.uuid
    if (!id) {
      throw new Error('Unable to determine user identifier from authentication response')
    }

    const firstName = payload.first_name || payload.given_name || null
    const lastName = payload.last_name || payload.family_name || null
    const inferredFullName = [firstName, lastName].filter(Boolean).join(' ')

    return {
      id,
      email: payload.email || payload.user?.email || null,
      full_name: payload.full_name || payload.name || inferredFullName || null,
      first_name: firstName,
      last_name: lastName,
      created_at: payload.created_at || null,
      ...payload
    }
  }

  const fetchCurrentUser = async (token: string): Promise<AuthUser> => {
    const response = await fetch(`${AUTH_BASE_URL}/me`, {
      method: 'GET',
      headers: buildHeaders(token)
    })

    if (!response.ok) {
      throw await parseAuthError(response)
    }

    const data = await response.json()
    return normalizeUser(data.user ?? data)
  }

  // Function to fetch and set profile data
  const loadProfile = async (userId: string, userData?: AuthUser) => {
    setProfileLoading(true)
    try {
      const profileData = await databaseService.getProfile(userId)

      if (profileData) {
        setProfile(profileData)
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: userId,
          email: userData?.email || user?.email || '',
          full_name: userData?.full_name || user?.full_name || '',
          avatar_url: null
        }

        const createdProfile = await databaseService.createProfile(newProfile)
        if (createdProfile) {
          setProfile(createdProfile)
        }
      }

      // Also check if patient record exists, create if not
      const patientData = await databaseService.getPatientByUserId(userId)
      if (!patientData) {
        console.log('No patient record found, creating one for existing user')
        // Extract first name from full name or user metadata
        const fullName = userData?.full_name || user?.full_name || profileData?.full_name || ''
        const firstName = fullName.split(' ')[0] || 'Patient'
        const lastName = fullName.split(' ').slice(1).join(' ') || ''

        const newPatient = {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: userData?.email || user?.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const createdPatient = await databaseService.createPatient(newPatient)
        if (createdPatient) {
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
      await loadProfile(user.id, user)
    }
  }

  // Function to update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user || !profile) return false

    const success = await databaseService.updateProfile(user.id, {
      ...updates,
      updated_at: new Date().toISOString()
    })

    if (success) {
      setProfile({ ...profile, ...updates })
    }

    return success
  }

  useEffect(() => {
    const initialiseAuth = async () => {
      const { accessToken, refreshToken } = getStoredTokens()

      if (!accessToken) {
        setLoading(false)
        return
      }

      setAuthTokens({ accessToken, refreshToken })

      try {
        const authenticatedUser = await fetchCurrentUser(accessToken)
        setUser(authenticatedUser)
        setSession({
          accessToken,
          refreshToken: refreshToken ?? null,
          expiresAt: null
        })
        await loadProfile(authenticatedUser.id, authenticatedUser)
      } catch (error) {
        console.error('Failed to restore user session:', error)
        clearAuthTokens()
        setSession(null)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initialiseAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = async (email: string, password: string, _options?: { data?: any }) => {
    console.warn('Sign up is not currently supported via the staging authentication API')
    return {
      error: {
        message: 'Account creation is not supported in this environment. Please contact support to create an account.'
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await parseAuthError(response)
        return { error }
      }

      const data = await response.json()
      const accessToken = data.token || data.access_token

      if (!accessToken) {
        return { error: { message: 'Authentication succeeded but no access token was returned.' } }
      }

      const refreshToken: string | null = data.refresh_token || data.refreshToken || null

      setAuthTokens({ accessToken, refreshToken })
      setSession({
        accessToken,
        refreshToken,
        expiresAt: data.expires_at || data.expires_in || null
      })

      const authenticatedUser = data.user ? normalizeUser(data.user) : await fetchCurrentUser(accessToken)

      setUser(authenticatedUser)
      await loadProfile(authenticatedUser.id, authenticatedUser)

      return { error: null }
    } catch (error) {
      console.error('Failed to sign in:', error)
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred during sign in'
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    console.warn('Google sign-in is not currently supported via the staging authentication API')
    return {
      error: {
        message: 'Google sign-in is not available in this environment.'
      }
    }
  }

  const signOut = async () => {
    clearAuthTokens()
    setSession(null)
    setUser(null)
    setProfile(null)
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const error = await parseAuthError(response)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Failed to request password reset:', error)
      return {
        error: {
          message: error instanceof Error ? error.message : 'Failed to initiate password reset'
        }
      }
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
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
