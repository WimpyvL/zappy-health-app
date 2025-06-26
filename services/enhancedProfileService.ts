import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  }

  /**
   * Update user preferences safely
   */
  async updatePreferences(
    userId: string, 
    preferences: Partial<Profile['preferences']>
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_user_preferences', {
        user_id: userId,
        new_preferences: preferences
      });

      if (error) {
        console.error('Error updating preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    }
  }

  /**
   * Update medical information safely
   */
  async updateMedicalInfo(
    userId: string,
    medicalInfo: Partial<Profile['medical_info']>
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_medical_info', {
        user_id: userId,
        new_medical_info: medicalInfo
      });

      if (error) {
        console.error('Error updating medical info:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMedicalInfo:', error);
      return false;
    }
  }

  /**
   * Get user age without exposing exact birthdate
   */
  async getUserAge(userId: string): Promise<number | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_age', {
        user_id: userId
      });

      if (error) {
        console.error('Error getting user age:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserAge:', error);
      return null;
    }
  }

  /**
   * Upload and update avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update profile with new avatar URL
      const updateSuccess = await this.updateProfile(userId, {
        avatar_url: avatarUrl
      });

      if (!updateSuccess) {
        return null;
      }

      return avatarUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<boolean> {
    try {
      // Get current profile to find avatar path
      const profile = await this.getProfile(userId);
      if (!profile?.avatar_url) {
        return true; // No avatar to delete
      }

      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const filePath = url.pathname.split('/storage/v1/object/public/avatars/')[1];

      if (filePath) {
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) {
          console.error('Error deleting avatar file:', deleteError);
        }
      }

      // Update profile to remove avatar URL
      return await this.updateProfile(userId, {
        avatar_url: null
      });
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      return false;
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
    ];

    return requiredFields.every(field => 
      profile[field as keyof Profile] !== null && 
      profile[field as keyof Profile] !== ''
    );
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
    ];

    const completedFields = allFields.filter(field => {
      const value = profile[field as keyof Profile];
      if (value === null || value === '') return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });

    return Math.round((completedFields.length / allFields.length) * 100);
  }

  /**
   * Validate profile data before update
   */
  validateProfileData(data: Partial<Profile>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Validate phone number format (basic validation)
    if (data.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone_number.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }

    // Validate date of birth (not in future, reasonable age range)
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future');
      } else if (age > 120) {
        errors.push('Invalid date of birth');
      }
    }

    // Validate medical info ranges
    if (data.medical_info) {
      const { height, weight } = data.medical_info;
      if (height && (height < 50 || height > 300)) {
        errors.push('Height must be between 50-300 cm');
      }
      if (weight && (weight < 20 || weight > 500)) {
        errors.push('Weight must be between 20-500 kg');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const enhancedProfileService = new EnhancedProfileService();
