import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      console.error('Error updating profile:', error)
      return false
    }

    return true
  },

  async createProfile(profile: Tables['profiles']['Insert']): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .insert(profile)

    if (error) {
      console.error('Error creating profile:', error)
      return false
    }

    return true
  }
}

// Health Records Services
export const healthRecordsService = {
  async getUserHealthRecords(userId: string): Promise<HealthRecord[]> {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching health records:', error)
      return []
    }

    return data || []
  },

  async createHealthRecord(record: Tables['health_records']['Insert']): Promise<boolean> {
    const { error } = await supabase
      .from('health_records')
      .insert(record)

    if (error) {
      console.error('Error creating health record:', error)
      return false
    }

    return true
  },

  async updateHealthRecord(id: string, updates: Tables['health_records']['Update']): Promise<boolean> {
    const { error } = await supabase
      .from('health_records')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating health record:', error)
      return false
    }

    return true
  },

  async deleteHealthRecord(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('health_records')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting health record:', error)
      return false
    }

    return true
  }
}

// Orders Services
export const ordersService = {
  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }

    return data || []
  },

  async createOrder(order: Tables['orders']['Insert']): Promise<string | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return null
    }

    return data?.id || null
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      return false
    }

    return true
  },

  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return null
    }

    return data
  }
}

// Patient Services
export const patientService = {
  async getPatient(userId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching patient:', error)
      return null
    }

    return data
  },

  async createPatient(patient: PatientInsert): Promise<boolean> {
    const { error } = await supabase
      .from('patients')
      .insert(patient)

    if (error) {
      console.error('Error creating patient:', error)
      return false
    }

    return true
  },

  async updatePatient(userId: string, updates: PatientUpdate): Promise<boolean> {
    const { error } = await supabase
      .from('patients')
      .update(updates)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating patient:', error)
      return false
    }

    return true
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