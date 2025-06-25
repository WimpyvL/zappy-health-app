import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthForm } from '../components/auth/AuthForm'
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton'
import { ArrowLeft } from 'lucide-react'

export const SignupPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={handleClose}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Zappy Health</h1>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Google Sign-Up */}
            <GoogleSignInButton text="Sign up with Google" />
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <AuthForm
              mode="signup"
              onToggleMode={() => navigate('/login')}
              onClose={() => navigate('/')}
              showToggle={false}
              isModal={false}
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500 underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
