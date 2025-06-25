// Environment-specific configuration for OAuth redirects
export const getAuthConfig = () => {
  const isDevelopment = import.meta.env.DEV
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
  
  return {
    // OAuth redirect URL - should point to this specific app
    redirectUrl: `${baseUrl}/auth/callback`,
    
    // Site URL for Supabase configuration
    siteUrl: baseUrl,
    
    // Development vs Production settings
    isDevelopment,
    
    // OAuth provider options
    googleOAuthOptions: {
      access_type: 'offline',
      prompt: 'consent',
      // Include app identifier to ensure redirect comes back here
      state: `app=zappy-health-patient&env=${isDevelopment ? 'dev' : 'prod'}`
    }
  }
}

// Helper to validate that we're in the correct app
export const validateAppRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  
  // Check state parameter to ensure this is our app
  const state = urlParams.get('state') || hashParams.get('state')
  
  if (state) {
    const stateParams = new URLSearchParams(state)
    const app = stateParams.get('app')
    
    if (app !== 'zappy-health-patient') {
      console.warn('OAuth redirect received for different app:', app)
      return false
    }
  }
  
  return true
}
