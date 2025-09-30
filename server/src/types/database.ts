export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone_number: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  address: Record<string, unknown> | null
  emergency_contact: Record<string, unknown> | null
  medical_info: Record<string, unknown> | null
  preferences: Record<string, unknown> | null
  subscription_status: 'free' | 'premium' | 'enterprise' | null
  subscription_expires_at: string | null
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type ProfileUpdate = Partial<Profile>

export interface HealthRecord {
  id: string
  user_id: string
  type: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type HealthRecordInsert = Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type HealthRecordUpdate = Partial<HealthRecordInsert>

export interface Order {
  id: string
  user_id: string
  status: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export type OrderInsert = Partial<Order>

export interface Patient {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  date_of_birth: string | null
  weight: number | null
  height: number | null
  target_weight?: number | null
  created_at: string
  updated_at: string
}

export type PatientInsert = Partial<Patient>
export type PatientUpdate = Partial<Patient>

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
    product_doses?: unknown
  }
}

export interface HomePageData {
  profile: Patient
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
