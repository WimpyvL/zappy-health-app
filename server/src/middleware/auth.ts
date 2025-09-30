import { NextFunction, Request, Response } from 'express'
import { API_BASE_URL } from '../lib/apiClient'
import { ENV } from '../env'

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string
        email?: string
        [key: string]: unknown
      }
      accessToken?: string
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization header' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(ENV.apiKey ? { 'X-API-KEY': ENV.apiKey } : {})
      }
    })

    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>

    if (!response.ok) {
      const status = response.status === 401 ? 401 : 500
      const message = typeof body.message === 'string' ? body.message : 'Failed to validate session'
      return res.status(status).json({ message })
    }

    const authPayload = (body.user ?? body) as Record<string, unknown>

    req.authUser = {
      id: String(authPayload.id),
      email: typeof authPayload.email === 'string' ? authPayload.email : undefined
    }
    req.accessToken = token
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ message: 'Failed to validate session' })
  }
}
