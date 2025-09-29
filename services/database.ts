import { apiClient } from '../lib/apiClient'

export interface Profile {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  [key: string]: unknown
}

export interface HealthRecord {
  id: string
  user_id: string
  record_type: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string
  notes?: string | null
  [key: string]: unknown
}

export interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  items: Record<string, unknown>[] | Record<string, unknown>
  created_at: string
  updated_at: string
  shipping_address?: Record<string, unknown> | null
  [key: string]: unknown
}

export interface Patient {
  id: string
  user_id: string
  first_name: string
  last_name: string | null
  email: string
  date_of_birth: string | null
  weight: number | null
  height: number | null
  target_weight: number | null
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export type PatientInsert = Partial<Omit<Patient, 'id'>> & Pick<Patient, 'user_id' | 'first_name' | 'email'>
export type PatientUpdate = Partial<Omit<Patient, 'id' | 'user_id'>>

const handleError = (message: string, error: unknown) => {
  console.error(message, error)
}

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      return await apiClient.get<Profile>(`profiles/${userId}`)
    } catch (error) {
      handleError('Error fetching profile:', error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    try {
      await apiClient.patch(`profiles/${userId}`, updates)
      return true
    } catch (error) {
      handleError('Error updating profile:', error)
      return false
    }
  },

  async createProfile(profile: Partial<Profile> & Pick<Profile, 'id' | 'email'>): Promise<boolean> {
    try {
      await apiClient.post('profiles', profile)
      return true
    } catch (error) {
      handleError('Error creating profile:', error)
      return false
    }
  }
}

// Health Records Services
export const healthRecordsService = {
  async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    try {
      return await apiClient.get<HealthRecord[]>(`health-records`, {
        query: { userId }
      })
    } catch (error) {
      handleError('Error fetching health records:', error)
      return []
    }
  },

  async createHealthRecord(record: Partial<HealthRecord> & Pick<HealthRecord, 'user_id' | 'record_type' | 'data'>): Promise<boolean> {
    try {
      await apiClient.post('health-records', record)
      return true
    } catch (error) {
      handleError('Error creating health record:', error)
      return false
    }
  },

  async updateHealthRecord(id: string, updates: Partial<HealthRecord>): Promise<boolean> {
    try {
      await apiClient.patch(`health-records/${id}`, updates)
      return true
    } catch (error) {
      handleError('Error updating health record:', error)
      return false
    }
  },

  async deleteHealthRecord(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`health-records/${id}`)
      return true
    } catch (error) {
      handleError('Error deleting health record:', error)
      return false
    }
  }
}

// Orders Services
export const ordersService = {
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      return await apiClient.get<Order[]>(`orders`, {
        query: { userId }
      })
    } catch (error) {
      handleError('Error fetching orders:', error)
      return []
    }
  },

  async createOrder(order: Partial<Order> & Pick<Order, 'user_id' | 'status' | 'total_amount' | 'items'>): Promise<string | null> {
    try {
      const response = await apiClient.post<{ id: string }>('orders', order)
      return response.id
    } catch (error) {
      handleError('Error creating order:', error)
      return null
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      await apiClient.patch(`orders/${orderId}`, { status, updated_at: new Date().toISOString() })
      return true
    } catch (error) {
      handleError('Error updating order status:', error)
      return false
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      return await apiClient.get<Order>(`orders/${orderId}`)
    } catch (error) {
      handleError('Error fetching order:', error)
      return null
    }
  }
}

// Patient Services
export const patientService = {
  async getPatient(userId: string): Promise<Patient | null> {
    try {
      return await apiClient.get<Patient>(`patients/by-user/${userId}`)
    } catch (error) {
      handleError('Error fetching patient:', error)
      return null
    }
  },

  async createPatient(patient: PatientInsert): Promise<boolean> {
    try {
      await apiClient.post('patients', patient)
      return true
    } catch (error) {
      handleError('Error creating patient:', error)
      return false
    }
  },

  async updatePatient(userId: string, updates: PatientUpdate): Promise<boolean> {
    try {
      await apiClient.patch(`patients/by-user/${userId}`, updates)
      return true
    } catch (error) {
      handleError('Error updating patient:', error)
      return false
    }
  }
}

// Real-time subscriptions (placeholder implementations until sockets are wired)
export const subscriptions = {
  subscribeToHealthRecords(_userId: string, _callback: (payload: unknown) => void) {
    console.warn('Real-time health record subscriptions are not yet implemented.')
    return {
      unsubscribe() {
        /* noop */
      }
    }
  },

  subscribeToOrders(_userId: string, _callback: (payload: unknown) => void) {
    console.warn('Real-time order subscriptions are not yet implemented.')
    return {
      unsubscribe() {
        /* noop */
      }
    }
  }
}
