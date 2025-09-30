import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { apiFetch } from './apiClient'

type Tables = Database['public']['Tables']
type Profile = Tables['profiles']['Row']
type HealthRecord = Tables['health_records']['Row']
type Order = Tables['orders']['Row']
type Patient = Tables['patients']['Row']
type PatientInsert = Tables['patients']['Insert']
type PatientUpdate = Tables['patients']['Update']

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      return await apiFetch<Profile>(`/profiles/${userId}`)
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    try {
      await apiFetch(`/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  },

  async createProfile(profile: Tables['profiles']['Insert']): Promise<boolean> {
    try {
      await apiFetch('/profiles', {
        method: 'POST',
        body: JSON.stringify(profile)
      })
      return true
    } catch (error) {
      console.error('Error creating profile:', error)
      return false
    }
  }
}

// Health Records Services
export const healthRecordsService = {
  async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    try {
      return await apiFetch<HealthRecord[]>(`/health-records?userId=${userId}`)
    } catch (error) {
      console.error('Error fetching health records:', error)
      return []
    }
  },

  async createHealthRecord(record: Tables['health_records']['Insert']): Promise<boolean> {
    try {
      await apiFetch('/health-records', {
        method: 'POST',
        body: JSON.stringify(record)
      })
      return true
    } catch (error) {
      console.error('Error creating health record:', error)
      return false
    }
  },

  async updateHealthRecord(id: string, updates: Tables['health_records']['Update']): Promise<boolean> {
    try {
      await apiFetch(`/health-records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      return true
    } catch (error) {
      console.error('Error updating health record:', error)
      return false
    }
  },

  async deleteHealthRecord(id: string): Promise<boolean> {
    try {
      await apiFetch(`/health-records/${id}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('Error deleting health record:', error)
      return false
    }
  }
}

// Orders Services
export const ordersService = {
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      return await apiFetch<Order[]>(`/orders?userId=${userId}`)
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  },

  async createOrder(order: Tables['orders']['Insert']): Promise<string | null> {
    try {
      const data = await apiFetch<{ id: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify(order)
      })
      return data?.id ?? null
    } catch (error) {
      console.error('Error creating order:', error)
      return null
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      return true
    } catch (error) {
      console.error('Error updating order status:', error)
      return false
    }
  },

  async getOrder(orderId: string): Promise<Order | null> {
    try {
      return await apiFetch<Order>(`/orders/${orderId}`)
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }
}

// Patient Services
export const patientService = {
  async getPatient(userId: string): Promise<Patient | null> {
    try {
      return await apiFetch<Patient>(`/patients/by-user/${userId}`)
    } catch (error) {
      console.error('Error fetching patient:', error)
      return null
    }
  },

  async createPatient(patient: PatientInsert): Promise<boolean> {
    try {
      await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify(patient)
      })
      return true
    } catch (error) {
      console.error('Error creating patient:', error)
      return false
    }
  },

  async updatePatient(userId: string, updates: PatientUpdate): Promise<boolean> {
    try {
      await apiFetch(`/patients/by-user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
      return true
    } catch (error) {
      console.error('Error updating patient:', error)
      return false
    }
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToHealthRecords(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('health_records_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_records',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToOrders(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}