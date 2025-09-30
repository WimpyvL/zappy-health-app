import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'
import { OrderInsert } from '../types/database'

const router = Router()

router.use(authenticate)

router.get('/', async (req, res) => {
  const userId = (req.query.userId as string) ?? req.authUser?.id
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.json(data ?? [])
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return res.status(500).json({ message: 'Failed to fetch orders' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ message: error.message })
    }

    return res.json(data)
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return res.status(500).json({ message: 'Failed to fetch order' })
  }
})

router.post('/', async (req, res) => {
  const payload = req.body as OrderInsert
  if (!payload?.user_id) {
    return res.status(400).json({ message: 'user_id is required' })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Failed to create order:', error)
    return res.status(500).json({ message: 'Failed to create order' })
  }
})

router.put('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body as { status?: string }

  if (!status) {
    return res.status(400).json({ message: 'status is required' })
  }

  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Failed to update order status:', error)
    return res.status(500).json({ message: 'Failed to update order status' })
  }
})

export default router
