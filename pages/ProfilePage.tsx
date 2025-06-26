import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { EnhancedUserProfile } from '../components/auth/EnhancedUserProfile'
import { AuthForm } from '../components/auth/AuthForm'

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-6 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Zappy Health</h2>
            <p className="mt-2 text-gray-600">Sign in to access your health profile</p>
          </div>
          
          <button
            onClick={() => setShowAuthForm(true)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </button>

          {showAuthForm && (
            <AuthForm
              mode={authMode}
              onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              onClose={() => setShowAuthForm(false)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <EnhancedUserProfile />
    </div>
  )
}

export default ProfilePage