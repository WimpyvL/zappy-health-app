import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'
import { ProfileInsert, ProfileUpdate } from '../types/database'

const router = Router()

router.use(authenticate)

router.get('/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return res.status(404).json({ message: error.message })
    }

    return res.json(data)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

router.post('/', async (req, res) => {
  const payload = req.body as ProfileInsert

  if (!payload?.id || !payload.email) {
    return res.status(400).json({ message: 'Profile id and email are required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Failed to create profile:', error)
    return res.status(500).json({ message: 'Failed to create profile' })
  }
})

router.put('/:userId', async (req, res) => {
  const { userId } = req.params
  const updates = req.body as ProfileUpdate

  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Failed to update profile:', error)
    return res.status(500).json({ message: 'Failed to update profile' })
  }
})

export default router
