import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { authenticate } from '../middleware/auth'
import {
  Appointment,
  CheckIn,
  EducationalResource,
  HomePageData,
  Patient,
  PatientOrder,
  Task
} from '../types/database'

const router = Router()

router.use(authenticate)

router.get('/', async (req, res) => {
  const userId = req.authUser?.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const profile = await getPatientProfile(userId)
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' })
    }

    const [
      activeOrders,
      nextAppointment,
      recentCheckIns,
      pendingTasks,
      recommendedResources,
      allPrograms
    ] = await Promise.all([
      getActiveOrders(profile.id),
      getNextAppointment(profile.id),
      getRecentCheckIns(profile.id, 5),
      getPendingTasks(profile.id),
      getRecommendedResources(5),
      getPatientPrograms(profile.id)
    ])

    const weeklyProgress = calculateWeeklyProgress(recentCheckIns, profile)

    const payload: HomePageData = {
      profile,
      activeOrders,
      nextAppointment,
      recentCheckIns,
      pendingTasks,
      recommendedResources,
      weeklyProgress,
      allPrograms
    }

    return res.json(payload)
  } catch (error) {
    console.error('Failed to fetch home data:', error)
    return res.status(500).json({ message: 'Failed to fetch home data' })
  }
})

router.post('/check-ins', async (req, res) => {
  const userId = req.authUser?.id
  const { weight } = req.body as { weight?: number }

  if (!userId || typeof weight !== 'number') {
    return res.status(400).json({ message: 'weight is required' })
  }

  try {
    const profile = await getPatientProfile(userId)
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' })
    }

    const { error } = await supabaseAdmin.from('check_ins').insert({
      patient_id: profile.id,
      weight,
      check_in_date: new Date().toISOString().split('T')[0]
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json({ message: 'Check-in logged' })
  } catch (error) {
    console.error('Failed to log check-in:', error)
    return res.status(500).json({ message: 'Failed to log check-in' })
  }
})

router.post('/tasks/:taskId/complete', async (req, res) => {
  const { taskId } = req.params

  try {
    const { error } = await supabaseAdmin
      .from('pb_tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(200).json({ message: 'Task completed' })
  } catch (error) {
    console.error('Failed to complete task:', error)
    return res.status(500).json({ message: 'Failed to complete task' })
  }
})

router.get('/programs', async (req, res) => {
  const userId = req.authUser?.id
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const profile = await getPatientProfile(userId)
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' })
    }

    const programs = await getPatientPrograms(profile.id)
    return res.json(programs)
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    return res.status(500).json({ message: 'Failed to fetch programs' })
  }
})

router.get('/programs/:category', async (req, res) => {
  const userId = req.authUser?.id
  const { category } = req.params

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const profile = await getPatientProfile(userId)
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found' })
    }

    const [orders, tasks, resources] = await Promise.all([
      supabaseAdmin
        .from('patient_orders')
        .select(`*, products ( name, category, product_doses (*) )`)
        .eq('patient_id', profile.id)
        .eq('products.category', category),
      supabaseAdmin
        .from('pb_tasks')
        .select('*')
        .eq('patient_id', profile.id)
        .eq('task_type', category)
        .eq('status', 'pending'),
      supabaseAdmin
        .from('educational_resources')
        .select('*')
        .eq('category', category)
        .eq('is_featured', true)
        .limit(3)
    ])

    if (orders.error) {
      return res.status(400).json({ message: orders.error.message })
    }

    if (tasks.error) {
      return res.status(400).json({ message: tasks.error.message })
    }

    if (resources.error) {
      return res.status(400).json({ message: resources.error.message })
    }

    return res.json({
      orders: (orders.data ?? []) as PatientOrder[],
      tasks: (tasks.data ?? []) as Task[],
      resources: (resources.data ?? []) as EducationalResource[]
    })
  } catch (error) {
    console.error('Failed to fetch program data:', error)
    return res.status(500).json({ message: 'Failed to fetch program data' })
  }
})

async function getPatientProfile(userId: string): Promise<Patient | null> {
  const { data, error } = await supabaseAdmin
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as Patient
}

async function getActiveOrders(patientId: string): Promise<PatientOrder[]> {
  const { data, error } = await supabaseAdmin
    .from('patient_orders')
    .select(`*, products ( name, category )`)
    .eq('patient_id', patientId)
    .eq('status', 'active')
    .order('next_refill_date', { ascending: true })

  if (error) {
    console.error('Failed to load active orders:', error)
    return []
  }

  return (data ?? []) as PatientOrder[]
}

async function getNextAppointment(patientId: string): Promise<Appointment | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .gte('appointment_date', today)
    .eq('status', 'scheduled')
    .order('appointment_date', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data as Appointment
}

async function getRecentCheckIns(patientId: string, limit: number): Promise<CheckIn[]> {
  const { data, error } = await supabaseAdmin
    .from('check_ins')
    .select('*')
    .eq('patient_id', patientId)
    .order('check_in_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load check-ins:', error)
    return []
  }

  return (data ?? []) as CheckIn[]
}

async function getPendingTasks(patientId: string): Promise<Task[]> {
  const { data, error } = await supabaseAdmin
    .from('pb_tasks')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true })

  if (error) {
    console.error('Failed to load tasks:', error)
    return []
  }

  return (data ?? []) as Task[]
}

async function getRecommendedResources(limit: number): Promise<EducationalResource[]> {
  const { data, error } = await supabaseAdmin
    .from('educational_resources')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load resources:', error)
    return []
  }

  return (data ?? []) as EducationalResource[]
}

async function getPatientPrograms(patientId: string): Promise<PatientOrder[]> {
  const { data, error } = await supabaseAdmin
    .from('patient_orders')
    .select(`*, products ( name, category, product_doses (*) )`)
    .eq('patient_id', patientId)

  if (error) {
    console.error('Failed to load programs:', error)
    return []
  }

  return (data ?? []) as PatientOrder[]
}

function calculateWeeklyProgress(checkIns: CheckIn[], profile: Patient) {
  const currentWeight = checkIns[0]?.weight ?? profile.weight ?? 0
  const previousWeight = checkIns[1]?.weight ?? profile.weight ?? 0
  const weightChange = currentWeight - previousWeight

  const targetWeight = profile.target_weight ?? ((profile.weight ?? currentWeight) - 50)
  const totalWeightToLose = (profile.weight ?? currentWeight) - targetWeight
  const weightLost = (profile.weight ?? currentWeight) - currentWeight
  const progressPercentage = totalWeightToLose
    ? Math.max(0, Math.min(100, (weightLost / totalWeightToLose) * 100))
    : 0
  const remainingToGoal = Math.max(0, currentWeight - targetWeight)

  return {
    currentWeight,
    weightChange,
    progressPercentage: Math.round(progressPercentage),
    remainingToGoal
  }
}

export default router
