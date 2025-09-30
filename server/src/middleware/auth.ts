import { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'

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
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    req.authUser = {
      id: data.user.id,
      email: data.user.email ?? undefined
    }
    req.accessToken = token
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ message: 'Failed to validate session' })
  }
}
