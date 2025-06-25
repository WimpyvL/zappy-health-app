import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Types for our data structures
export interface PatientProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  weight: number;
  height: number;
  target_weight?: number;
  created_at: string;
  updated_at: string;
}

export interface PatientOrder {
  id: string;
  patient_id: string;
  product_id: string;
  status: string;
  quantity: number;
  dosage: string;
  frequency: string;
  next_refill_date: string;
  created_at: string;
  products?: {
    name: string;
    category: string;
  };
}

export interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_type: string;
  status: string;
  notes?: string;
}

export interface CheckIn {
  id: string;
  patient_id: string;
  weight?: number;
  progress_notes?: string;
  check_in_date: string;
  created_at: string;
}

export interface Task {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  task_type: string;
  status: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  content: string;
  category: string;
  read_time?: number;
  is_featured: boolean;
  tags?: string[];
  created_at: string;
}

export interface HomePageData {
  profile: PatientProfile;
  activeOrders: PatientOrder[];
  nextAppointment: Appointment | null;
  recentCheckIns: CheckIn[];
  pendingTasks: Task[];
  recommendedResources: EducationalResource[];
  weeklyProgress: {
    currentWeight: number;
    weightChange: number;
    progressPercentage: number;
    remainingToGoal: number;
  };
  allPrograms: PatientOrder[];
}

/**
 * Centralized Database Service
 * Single entry point for all database operations
 */
class DatabaseService {
  /**
   * Get all data needed for the HomePage in a single call
   */
  async getHomePageData(user: User): Promise<HomePageData | null> {
    try {
      // Get patient profile first
      const profile = await this.getPatientProfile(user.id);
      if (!profile) {
        throw new Error('Patient profile not found');
      }

      // Fetch all data in parallel for better performance
      const [
        activeOrders,
        nextAppointment,
        recentCheckIns,
        pendingTasks,
        recommendedResources,
        allPrograms
      ] = await Promise.all([
        this.getActiveOrders(profile.id),
        this.getNextAppointment(profile.id),
        this.getRecentCheckIns(profile.id, 5),
        this.getPendingTasks(profile.id),
        this.getRecommendedResources(5),
        this.getPatientPrograms(profile.id)
      ]);

      // Calculate weekly progress
      const weeklyProgress = this.calculateWeeklyProgress(recentCheckIns, profile);

      return {
        profile,
        activeOrders,
        nextAppointment,
        recentCheckIns,
        pendingTasks,
        recommendedResources,
        weeklyProgress,
        allPrograms
      };
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return null;
    }
  }

  /**
   * Get patient profile by user ID
   */
  private async getPatientProfile(userId: string): Promise<PatientProfile | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching patient profile:', error);
      return null;
    }
    return data;
  }

  /**
   * Get active medication orders
   */
  private async getActiveOrders(patientId: string): Promise<PatientOrder[]> {
    const { data, error } = await supabase
      .from('patient_orders')
      .select(`
        *,
        products (
          name,
          category
        )
      `)
      .eq('patient_id', patientId)
      .eq('status', 'active')
      .order('next_refill_date', { ascending: true });

    if (error) {
      console.error('Error fetching active orders:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get next upcoming appointment
   */
  private async getNextAppointment(patientId: string): Promise<Appointment | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .gte('appointment_date', today)
      .eq('status', 'scheduled')
      .order('appointment_date', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching next appointment:', error);
      return null;
    }
    return data;
  }

  /**
   * Get recent check-ins for progress tracking
   */
  private async getRecentCheckIns(patientId: string, limit: number = 5): Promise<CheckIn[]> {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('patient_id', patientId)
      .order('check_in_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent check-ins:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get pending tasks for the patient
   */
  private async getPendingTasks(patientId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('pb_tasks')
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending tasks:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get recommended educational resources
   */
  private async getRecommendedResources(limit: number = 5): Promise<EducationalResource[]> {
    const { data, error } = await supabase
      .from('educational_resources')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching educational resources:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Calculate weekly progress metrics
   */
  private calculateWeeklyProgress(checkIns: CheckIn[], profile: PatientProfile) {
    const currentWeight = checkIns[0]?.weight || profile.weight;
    const previousWeight = checkIns[1]?.weight || profile.weight;
    const weightChange = currentWeight - previousWeight;
    
    const targetWeight = profile.target_weight || profile.weight - 50; // Default goal
    const totalWeightToLose = profile.weight - targetWeight;
    const weightLost = profile.weight - currentWeight;
    const progressPercentage = Math.max(0, Math.min(100, (weightLost / totalWeightToLose) * 100));
    const remainingToGoal = Math.max(0, currentWeight - targetWeight);

    return {
      currentWeight,
      weightChange,
      progressPercentage: Math.round(progressPercentage),
      remainingToGoal
    };
  }

  /**
   * Log a new weight entry
   */
  async logWeight(patientId: string, weight: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('check_ins')
        .insert({
          patient_id: patientId,
          weight,
          check_in_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error logging weight:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error logging weight:', error);
      return false;
    }
  }

  /**
   * Mark a task as completed
   */
  async completeTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pb_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error completing task:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  }

  /**
   * Get all programs/treatments for a patient
   */
  async getPatientPrograms(patientId: string) {
    const { data, error } = await supabase
      .from('patient_orders')
      .select(`
        *,
        products (
          name,
          category,
          product_doses (*)
        )
      `)
      .eq('patient_id', patientId);

    if (error) {
      console.error('Error fetching patient programs:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Get program-specific tasks and data
   */
  async getProgramSpecificData(patientId: string, programCategory: string) {
    try {
      // Get orders for this specific program category
      const { data: programOrders, error: ordersError } = await supabase
        .from('patient_orders')
        .select(`
          *,
          products (
            name,
            category,
            product_doses (*)
          )
        `)
        .eq('patient_id', patientId)
        .eq('products.category', programCategory);

      if (ordersError) {
        console.error('Error fetching program orders:', ordersError);
      }

      // Get program-specific tasks
      const { data: programTasks, error: tasksError } = await supabase
        .from('pb_tasks')
        .select('*')
        .eq('patient_id', patientId)
        .eq('task_type', programCategory)
        .eq('status', 'pending');

      if (tasksError) {
        console.error('Error fetching program tasks:', tasksError);
      }

      // Get program-specific educational resources
      const { data: programResources, error: resourcesError } = await supabase
        .from('educational_resources')
        .select('*')
        .eq('category', programCategory)
        .eq('is_featured', true)
        .limit(3);

      if (resourcesError) {
        console.error('Error fetching program resources:', resourcesError);
      }

      return {
        orders: programOrders || [],
        tasks: programTasks || [],
        resources: programResources || []
      };
    } catch (error) {
      console.error('Error fetching program specific data:', error);
      return {
        orders: [],
        tasks: [],
        resources: []
      };
    }
  }
}

// Export a single instance
export const databaseService = new DatabaseService();
