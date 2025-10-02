import { useAuth } from '../contexts/AuthContext'

/**
 * Custom hook to access user profile information
 * Provides easy access to profile data and loading states
 */
export const useProfile = () => {
  const { user, profile, profileLoading, updateProfile, refreshProfile } = useAuth()

  return {
    // Profile data
    profile,
    isLoggedIn: !!user,
    isProfileLoading: profileLoading,
    
    // Computed values for easy access
    displayName: profile?.full_name || (user?.user_metadata as any)?.full_name || null,
    email: profile?.email || user?.email || null,
    avatarUrl: profile?.avatar_url || null,
    memberSince: profile?.created_at && typeof profile.created_at === 'string' ? new Date(profile.created_at) : null,
    
    // Actions
    updateProfile,
    refreshProfile,
  }
}
