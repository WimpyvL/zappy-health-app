import React, { useState } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthForm } from './AuthForm'
import { UserProfile } from './UserProfile'

export const AuthButton: React.FC = () => {
  const { user, loading } = useAuth()
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          if (user) {
            setShowProfile(true)
          } else {
            setShowAuthForm(true)
          }
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
        aria-label={user ? "View profile" : "Sign in"}
      >
        <User className="w-4 h-4 text-blue-600" />
        {user ? (
          <span className="text-sm font-medium text-blue-700">
            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
          </span>
        ) : (
          <span className="text-sm font-medium text-blue-700">Sign In</span>
        )}
      </button>

      {showAuthForm && (
        <AuthForm
          mode={authMode}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          onClose={() => setShowAuthForm(false)}
        />
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Your Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <UserProfile />
            </div>
          </div>
        </div>
      )}
    </>
  )
}