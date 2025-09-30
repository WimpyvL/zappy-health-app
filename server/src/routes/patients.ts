import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'
import { PatientInsert, PatientUpdate } from '../types/database'

const router = Router()

router.use(authenticate)

router.get('/by-user/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return res.status(404).json({ message: error.message })
    }

    return res.json(data)
  } catch (error) {
    console.error('Failed to fetch patient:', error)
    return res.status(500).json({ message: 'Failed to fetch patient' })
  }
})

router.post('/', async (req, res) => {
  const payload = req.body as PatientInsert
  if (!payload?.user_id || !payload?.first_name) {
    return res.status(400).json({ message: 'user_id and first_name are required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single()

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Failed to create patient:', error)
    return res.status(500).json({ message: 'Failed to create patient' })
  }
})

router.put('/by-user/:userId', async (req, res) => {
  const { userId } = req.params
  const updates = req.body as PatientUpdate

  try {
    const { error } = await supabaseAdmin
      .from('patients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Failed to update patient:', error)
    return res.status(500).json({ message: 'Failed to update patient' })
  }
})

export default router
