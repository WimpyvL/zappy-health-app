import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { API_BASE_URL } from '../lib/apiClient'
import { ENV } from '../env'

const router = Router()

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  ...(ENV.apiKey ? { 'X-API-KEY': ENV.apiKey } : {})
})

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email, password })
    })

    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return res.status(response.status).json(body)
    }

    return res.status(response.status).json(body)
  } catch (error) {
    console.error('Sign-in error:', error)
    return res.status(500).json({ message: 'Failed to sign in' })
  }
})

router.post('/sign-out', (_req, res) => {
  // Tokens are stateless JWTs. Clearing them on the client is sufficient.
  return res.status(200).json({ message: 'Signed out successfully' })
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email })
    })

    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return res.status(response.status).json(body)
    }

    return res.status(response.status).json(body)
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ message: 'Failed to request password reset' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(req.body ?? {})
    })

    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      return res.status(response.status).json(body)
    }

    return res.status(response.status).json(body)
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({ message: 'Failed to reset password' })
  }
})

router.get('/session', authenticate, async (req, res) => {
  return res.json({
    user: req.authUser,
    accessToken: req.accessToken
  })
})

export default router
