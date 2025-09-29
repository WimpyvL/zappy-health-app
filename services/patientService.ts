import { apiClient } from '../lib/apiClient'

export interface PatientProfile {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  weight_current: number
  weight_goal: number
  weight_start: number
  height: number
  created_at: string
  updated_at: string
}

export interface PatientOrder {
  id: string
  patient_id: string
  medication_name: string
  dosage: string
  frequency: string
  quantity: number
  refill_date: string
  status: string
  instructions: string
  created_at: string
}

export interface CheckIn {
  id: string
  patient_id: string
  weight: number
  notes: string
  scheduled_date: string
  completed_date: string | null
  created_at: string
}

export interface EducationalResource {
  id: string
  title: string
  content: string
  summary: string
  category: string
  reading_time_minutes: number
  is_featured: boolean
  image_url: string | null
  created_at: string
}

export interface PbTask {
  id: string
  patient_id: string
  task_type: string
  title: string
  description: string
  due_date: string
  completed_date: string | null
  status: string
  medication_name: string | null
  dosage: string | null
  created_at: string
}

const handleError = (message: string, error: unknown) => {
  console.error(message, error)
}

export const getCurrentPatientProfile = async (userId: string): Promise<PatientProfile | null> => {
  try {
    return await apiClient.get<PatientProfile>(`patients/${userId}`)
  } catch (error) {
    handleError('Error fetching patient profile:', error)
    return null
  }
}

export const getActivePatientOrders = async (patientId: string): Promise<PatientOrder[]> => {
  try {
    return await apiClient.get<PatientOrder[]>(`patients/${patientId}/orders`, {
      query: { status: 'active,ordered,shipped' }
    })
  } catch (error) {
    handleError('Error fetching patient orders:', error)
    return []
  }
}

export const getUpcomingCheckIns = async (patientId: string): Promise<CheckIn[]> => {
  try {
    return await apiClient.get<CheckIn[]>(`patients/${patientId}/check-ins`, {
      query: {
        status: 'upcoming',
        limit: 5,
      }
    })
  } catch (error) {
    handleError('Error fetching check-ins:', error)
    return []
  }
}

export const getFeaturedEducationalResources = async (): Promise<EducationalResource[]> => {
  try {
    return await apiClient.get<EducationalResource[]>(`educational-resources`, {
      query: {
        featured: true,
        limit: 3,
      }
    })
  } catch (error) {
    handleError('Error fetching educational resources:', error)
    return []
  }
}

export const getCurrentPatientTasks = async (patientId: string): Promise<PbTask[]> => {
  try {
    const today = new Date().toISOString().split('T')[0]
    return await apiClient.get<PbTask[]>(`patients/${patientId}/tasks`, {
      query: {
        status: 'pending',
        dueBefore: today,
      }
    })
  } catch (error) {
    handleError('Error fetching patient tasks:', error)
    return []
  }
}

export const calculateWeightProgress = (current: number, start: number, goal: number) => {
  const totalToLose = start - goal
  const lostSoFar = start - current
  const progressPercentage = Math.round((lostSoFar / totalToLose) * 100)
  const remaining = current - goal

  return {
    progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
    lostSoFar,
    remaining: Math.max(0, remaining),
    weeklyChange: 0
  }
}

export const markTaskCompleted = async (taskId: string): Promise<boolean> => {
  try {
    await apiClient.patch(`tasks/${taskId}`, {
      status: 'completed',
      completed_date: new Date().toISOString(),
    })
    return true
  } catch (error) {
    handleError('Error marking task as completed:', error)
    return false
  }
}

export const logWeight = async (patientId: string, weight: number, notes?: string): Promise<boolean> => {
  try {
    await apiClient.patch(`patients/${patientId}`, {
      weight_current: weight,
      updated_at: new Date().toISOString(),
    })

    try {
      await apiClient.post('weight-logs', {
        patient_id: patientId,
        weight,
        notes: notes || '',
        logged_date: new Date().toISOString(),
      })
    } catch (error) {
      handleError('Error logging weight:', error)
    }

    return true
  } catch (error) {
    handleError('Error updating patient weight:', error)
    return false
  }
}
