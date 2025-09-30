export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone_number?: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  address?: Record<string, unknown> | null
  emergency_contact?: Record<string, unknown> | null
  medical_info?: Record<string, unknown> | null
  preferences?: Record<string, unknown> | null
  subscription_status?: 'free' | 'premium' | 'enterprise' | null
  subscription_expires_at?: string | null
  [key: string]: unknown
}

export type ProfileInsert = {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  phone_number?: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  address?: Record<string, unknown> | null
  emergency_contact?: Record<string, unknown> | null
  medical_info?: Record<string, unknown> | null
  preferences?: Record<string, unknown> | null
  subscription_status?: 'free' | 'premium' | 'enterprise' | null
  subscription_expires_at?: string | null
  [key: string]: unknown
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
  updated_at?: string
}

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
  [key: string]: unknown
}

export type PatientInsert = {
  user_id: string
  first_name: string
  last_name?: string
  email?: string
  date_of_birth?: string | null
  weight?: number | null
  height?: number | null
  target_weight?: number | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export type PatientUpdate = Partial<Omit<Patient, 'id' | 'user_id' | 'created_at'>> & {
  updated_at?: string
}

export interface HealthRecord {
  id: string
  user_id: string
  type: string
  value: Record<string, unknown>
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export type HealthRecordInsert = Partial<Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>> & {
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

export interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_type: string
  status: string
  notes?: string
  [key: string]: unknown
}

export interface CheckIn {
  id: string
  patient_id: string
  weight?: number
  progress_notes?: string
  check_in_date: string
  created_at: string
  [key: string]: unknown
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
  [key: string]: unknown
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
  [key: string]: unknown
}

export interface ProductSummary {
  name: string
  category: string
  product_doses?: unknown
  [key: string]: unknown
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
  products?: ProductSummary
  [key: string]: unknown
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

export interface Conversation {
  id: string
  created_at: string
  updated_at: string
  patient_id: string
  doctor_id: string
  subject: string | null
  status: string
  last_message_at: string
  [key: string]: unknown
}

export interface Doctor {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  full_name: string
  specialty: string
  license_number?: string | null
  avatar_url?: string | null
  bio?: string | null
  is_active: boolean
  theme_color?: string | null
  [key: string]: unknown
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  read_at: string | null
  is_edited?: boolean
  edited_at?: string | null
  [key: string]: unknown
}

export interface MessageReadStatus {
  message_id: string
  user_id: string
  read_at?: string
}
