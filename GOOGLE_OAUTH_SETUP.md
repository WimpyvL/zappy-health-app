# Google OAuth Setup for Supabase

To enable Google Sign-In in your Zappy Health app, you need to configure Google OAuth in your Supabase project.

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add your authorized redirect URIs:
     - For development: `http://localhost:5173/auth/callback`
     - For production: `https://your-patient-app-domain.com/auth/callback`
     - Supabase callback: `https://your-project-ref.supabase.co/auth/v1/callback`
   - **Important**: Make sure the redirect URIs point to YOUR patient app, not any other app that might share the same Supabase project

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click "Configure"
4. Enable Google authentication
5. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Set the redirect URL (should be auto-populated):
   - `https://your-project-ref.supabase.co/auth/v1/callback`

## Step 3: Environment Variables

Create a `.env` file with the correct configuration:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# Optional: Specify your app URL explicitly (recommended for multi-app setups)
VITE_APP_URL=http://localhost:5173
```

For production, update `VITE_APP_URL` to your patient app's production domain.

## Step 4: Update Site URL (Important!)

In your Supabase project settings:
1. Go to "Authentication" → "URL Configuration"
2. Set your **Site URL** to:
   - Development: `http://localhost:5173`
   - Production: `https://your-patient-app-domain.com`
3. Add redirect URLs (these should match your OAuth callback URLs):
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://your-patient-app-domain.com/auth/callback`

**Critical for Multi-App Setup**: Make sure these URLs point specifically to your patient app, not any other apps that might share the same Supabase project.

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app

## Troubleshooting

- **"redirect_uri_mismatch"**: Check that your redirect URIs in Google Cloud Console match your Supabase callback URL
- **"origin_mismatch"**: Ensure your site URL in Supabase matches your development/production domain
- **User not created**: Check your Supabase logs for any RLS policy issues with the profiles table

## Profile Creation

When users sign in with Google, Supabase will automatically:
1. Create a user in the `auth.users` table
2. Populate `user_metadata` with Google profile info (name, avatar, email)
3. Your app should create a corresponding profile in the `profiles` table using the database trigger or your application logic

The Google sign-in flow provides these user metadata fields:
- `full_name`: User's display name from Google
- `avatar_url`: User's profile picture URL
- `email`: User's email address
- `email_verified`: Whether the email is verified (always true for Google)
