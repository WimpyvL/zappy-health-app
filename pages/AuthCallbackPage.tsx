import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { validateAppRedirect } from '../lib/auth-config'

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // First, validate that this redirect is intended for our app
        if (!validateAppRedirect()) {
          setError('This authentication session is not intended for this application.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
          return
        }

        // Check if there's a hash fragment with auth data
        const hashFragment = window.location.hash
        
        if (hashFragment.includes('error=')) {
          // Extract error from URL
          const urlParams = new URLSearchParams(hashFragment.substring(1))
          const errorDescription = urlParams.get('error_description') || 'Authentication failed'
          setError(errorDescription)
          
          // Redirect to login page after a delay
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
          return
        }

        // If we have a user, authentication was successful
        if (user) {
          // Check if user is new (just signed up) or returning
          const isNewUser = user.created_at && 
            new Date(user.created_at).getTime() > Date.now() - 10000 // Created within last 10 seconds
          
          if (isNewUser) {
            // New user - redirect to onboarding or profile setup
            navigate('/', { replace: true })
          } else {
            // Returning user - go to dashboard/home
            navigate('/', { replace: true })
          }
        } else if (!loading) {
          // No user and not loading - something went wrong
          setError('Authentication failed. Please try again.')
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred during authentication.')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }

    // Small delay to ensure auth state is updated
    const timer = setTimeout(handleAuthCallback, 1000)
    return () => clearTimeout(timer)
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  // This should not be reached in normal flow
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  )
}

export default AuthCallbackPage
