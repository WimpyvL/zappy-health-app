import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../hooks/useProfile'

export const UserProfile: React.FC = () => {
  const { signOut } = useAuth()
  const { profile, isProfileLoading, updateProfile, email, memberSince } = useProfile()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!profile) return

    const success = await updateProfile({
      full_name: fullName,
    })

    if (success) {
      setEditing(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
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
          <p className="text-sm text-gray-600">{email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                aria-label="Full name"
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
            {memberSince ? memberSince.toLocaleDateString() : 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  )
}