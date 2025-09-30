import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'
import { HealthRecordInsert, HealthRecordUpdate } from '../types/database'

const router = Router()

router.use(authenticate)

router.get('/', async (req, res) => {
  const userId = (req.query.userId as string) ?? req.authUser?.id
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.json(data ?? [])
  } catch (error) {
    console.error('Failed to fetch health records:', error)
    return res.status(500).json({ message: 'Failed to fetch health records' })
  }
})

router.post('/', async (req, res) => {
  const payload = req.body as HealthRecordInsert
  if (!payload?.user_id) {
    return res.status(400).json({ message: 'user_id is required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('health_records')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Failed to create health record:', error)
    return res.status(500).json({ message: 'Failed to create health record' })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const updates = req.body as HealthRecordUpdate

  try {
    const { error } = await supabaseAdmin
      .from('health_records')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Failed to update health record:', error)
    return res.status(500).json({ message: 'Failed to update health record' })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { error } = await supabaseAdmin
      .from('health_records')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Failed to delete health record:', error)
    return res.status(500).json({ message: 'Failed to delete health record' })
  }
})

export default router
