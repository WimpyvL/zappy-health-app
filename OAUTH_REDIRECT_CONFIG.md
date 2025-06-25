# OAuth Redirect Configuration for Multi-App Setup

## Problem
When multiple apps (patient app, provider app, admin app) share the same Supabase backend, OAuth redirects can accidentally send users to the wrong application.

## Solution
This patient app implements specific redirect handling to ensure users always return here after OAuth authentication.

## Implementation

### 1. Explicit Redirect URLs
- **Development**: `http://localhost:5173/auth/callback`
- **Production**: `https://your-patient-app-domain.com/auth/callback`

### 2. State Parameter Validation
Each OAuth request includes a state parameter with app identification:
```
state=app=zappy-health-patient&env=dev
```

### 3. Callback Route Handler
The `/auth/callback` route validates the redirect and handles:
- Error states from OAuth provider
- App validation (ensures redirect was intended for this app)
- User state management (new vs returning users)
- Proper navigation after successful authentication

### 4. Environment Configuration
The `auth-config.ts` file provides environment-specific settings:
- Automatic detection of dev vs production
- Configurable redirect URLs via environment variables
- OAuth provider options

## Configuration Checklist

### Google Cloud Console
- [ ] Add specific callback URLs for this patient app
- [ ] Ensure URLs don't conflict with other apps

### Supabase Dashboard
- [ ] Set Site URL to patient app domain
- [ ] Add redirect URLs in Authentication settings
- [ ] Verify OAuth provider configuration

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173  # Patient app URL
```

### Production Deployment
- [ ] Update `VITE_APP_URL` to production domain
- [ ] Add production callback URL to Google OAuth
- [ ] Update Supabase Site URL for production

## Security Benefits
1. **App Isolation**: Prevents cross-app authentication leaks
2. **State Validation**: Ensures redirects are legitimate
3. **Error Handling**: Graceful fallback for failed authentications
4. **Environment Awareness**: Different behavior for dev/prod

## Testing
1. Start patient app: `npm run dev`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect lands on `/auth/callback`
5. Check that final navigation goes to patient app home page

This configuration ensures that OAuth flows initiated from the patient app always return to the patient app, regardless of other applications sharing the same Supabase backend.
