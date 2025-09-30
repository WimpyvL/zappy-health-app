import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.session) {
      return res.status(401).json({ message: error?.message ?? 'Invalid credentials' })
    }

    return res.json({
      session: data.session,
      user: data.user
    })
  } catch (error) {
    console.error('Sign-in error:', error)
    return res.status(500).json({ message: 'Failed to sign in' })
  }
})

router.post('/sign-out', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ message: 'refreshToken is required' })
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.signOut(refreshToken)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(200).json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Sign-out error:', error)
    return res.status(500).json({ message: 'Failed to sign out' })
  }
})

router.get('/session', authenticate, async (req, res) => {
  return res.json({
    user: req.authUser,
    accessToken: req.accessToken
  })
})

export default router
