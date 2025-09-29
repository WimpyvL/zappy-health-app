import { apiClient } from '../lib/apiClient'
import type { Profile } from './database'

type ProfileUpdate = Partial<Profile>

type PreferencesPayload = Partial<Profile['preferences']>
type MedicalInfoPayload = Partial<Profile['medical_info']>

/**
 * Enhanced Profile Service
 * Handles all profile-related operations with comprehensive user data
 */
export class EnhancedProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      return await apiClient.get<Profile>(`profiles/${userId}`)
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<boolean> {
    try {
      await apiClient.patch(`profiles/${userId}`, {
        ...updates,
        updated_at: new Date().toISOString()
      })
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  }

  /**
   * Update user preferences safely
   */
  async updatePreferences(userId: string, preferences: PreferencesPayload): Promise<boolean> {
    try {
      await apiClient.patch(`profiles/${userId}/preferences`, { preferences })
      return true
    } catch (error) {
      console.error('Error updating preferences:', error)
      return false
    }
  }

  /**
   * Update medical information safely
   */
  async updateMedicalInfo(userId: string, medicalInfo: MedicalInfoPayload): Promise<boolean> {
    try {
      await apiClient.patch(`profiles/${userId}/medical-info`, { medicalInfo })
      return true
    } catch (error) {
      console.error('Error updating medical info:', error)
      return false
    }
  }

  /**
   * Get user age without exposing exact birthdate
   */
  async getUserAge(userId: string): Promise<number | null> {
    try {
      const response = await apiClient.get<{ age: number }>(`profiles/${userId}/age`)
      return typeof response?.age === 'number' ? response.age : null
    } catch (error) {
      console.error('Error getting user age:', error)
      return null
    }
  }

  /**
   * Upload and update avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiClient.post<{ url: string }>(`profiles/${userId}/avatar`, formData)
      const avatarUrl = response?.url

      if (!avatarUrl) {
        return null
      }

      const updateSuccess = await this.updateProfile(userId, {
        avatar_url: avatarUrl
      })

      if (!updateSuccess) {
        return null
      }

      return avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return null
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<boolean> {
    try {
      await apiClient.delete(`profiles/${userId}/avatar`)
      return await this.updateProfile(userId, {
        avatar_url: null
      })
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return false
    }
  }

  /**
   * Check if user has completed their profile
   */
  isProfileComplete(profile: Profile): boolean {
    const requiredFields = [
      'full_name',
      'phone_number',
      'date_of_birth'
    ]

    return requiredFields.every(field =>
      profile[field as keyof Profile] !== null &&
      profile[field as keyof Profile] !== ''
    )
  }

  /**
   * Get profile completion percentage
   */
  getProfileCompletionPercentage(profile: Profile): number {
    const allFields = [
      'full_name',
      'phone_number',
      'date_of_birth',
      'gender',
      'avatar_url',
      'emergency_contact',
      'medical_info'
    ]

    const completedFields = allFields.filter(field => {
      const value = profile[field as keyof Profile]
      if (value === null || value === '') return false
      if (typeof value === 'object' && value !== null && Object.keys(value as Record<string, unknown>).length === 0) return false
      return true
    })

    return Math.round((completedFields.length / allFields.length) * 100)
  }

  /**
   * Validate profile data before update
   */
  validateProfileData(data: Partial<Profile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format')
    }

    if (data.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(String(data.phone_number).replace(/\s/g, ''))) {
      errors.push('Invalid phone number format')
    }

    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future')
      } else if (age > 120) {
        errors.push('Invalid date of birth')
      }
    }

    if (data.medical_info) {
      const { height, weight } = data.medical_info
      if (height && (height < 50 || height > 300)) {
        errors.push('Height must be between 50-300 cm')
      }
      if (weight && (weight < 20 || weight > 500)) {
        errors.push('Weight must be between 20-500 kg')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export const enhancedProfileService = new EnhancedProfileService()
