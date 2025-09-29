import { apiClient } from '../lib/apiClient'
import type { AuthUser } from '../contexts/AuthContext'

export interface PatientProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  weight: number
  height: number
  target_weight?: number
  created_at: string
  updated_at: string
}

export interface PatientOrder {
  id: string
  patient_id: string
  product_id: string
  status: string
  quantity: number
  dosage: string
  frequency: string
  next_refill_date: string
  created_at: string
  products?: {
    name: string
    category: string
  }
}

export interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_type: string
  status: string
  notes?: string
}

export interface CheckIn {
  id: string
  patient_id: string
  weight?: number
  progress_notes?: string
  check_in_date: string
  created_at: string
}

export interface Task {
  id: string
  patient_id: string
  title: string
  description?: string
  task_type: string
  status: string
  due_date?: string
  completed_at?: string
  created_at: string
}

export interface EducationalResource {
  id: string
  title: string
  content: string
  category: string
  read_time?: number
  is_featured: boolean
  tags?: string[]
  created_at: string
}

export interface HomePageData {
  profile: PatientProfile
  activeOrders: PatientOrder[]
  nextAppointment: Appointment | null
  recentCheckIns: CheckIn[]
  pendingTasks: Task[]
  recommendedResources: EducationalResource[]
  weeklyProgress: {
    currentWeight: number
    weightChange: number
    progressPercentage: number
    remainingToGoal: number
  }
  allPrograms: PatientOrder[]
}

class DatabaseService {
  async getHomePageData(user: AuthUser): Promise<HomePageData | null> {
    try {
      return await apiClient.get<HomePageData>(`patients/${user.id}/dashboard`)
    } catch (error) {
      console.error('Error fetching homepage data:', error)
      return null
    }
  }
}

export const databaseService = new DatabaseService()
