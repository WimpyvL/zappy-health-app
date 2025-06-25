import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { profileService } from '../../services/database'
import type { Database } from '../../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    setLoading(true)
    const profileData = await profileService.getProfile(user.id)
    
    if (profileData) {
      setProfile(profileData)
      setFullName(profileData.full_name || '')
    } else {
      // Create profile if it doesn't exist
      const newProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: null,
      }
      
      const success = await profileService.createProfile(newProfile)
      if (success) {
        setProfile(newProfile as Profile)
        setFullName(newProfile.full_name)
      }
    }
    setLoading(false)
  }

  const handleUpdateProfile = async () => {
    if (!user || !profile) return

    const success = await profileService.updateProfile(user.id, {
      full_name: fullName,
      updated_at: new Date().toISOString()
    })

    if (success) {
      setProfile({ ...profile, full_name: fullName })
      setEditing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profile</h3>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-sm text-gray-600">{profile.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleUpdateProfile}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setFullName(profile.full_name || '')
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{profile.full_name || 'Not set'}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Member Since</label>
          <p className="text-sm text-gray-600">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}