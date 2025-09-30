import { User } from '@supabase/supabase-js';
import { apiFetch } from './apiClient';

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
      return await apiFetch<HomePageData>('/home');
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return null;
    }
  }

  /**
   * Log a new weight entry
   */
  async logWeight(patientId: string, weight: number): Promise<boolean> {
    try {
      await apiFetch('/home/check-ins', {
        method: 'POST',
        body: JSON.stringify({ weight })
      });
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
      await apiFetch(`/home/tasks/${taskId}/complete`, {
        method: 'POST'
      });
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
    try {
      return await apiFetch<PatientOrder[]>('/home/programs');
    } catch (error) {
      console.error('Error fetching patient programs:', error);
      return [];
    }
  }

  /**
   * Get program-specific tasks and data
   */
  async getProgramSpecificData(patientId: string, programCategory: string) {
    try {
      return await apiFetch<{ orders: PatientOrder[]; tasks: Task[]; resources: EducationalResource[] }>(
        `/home/programs/${programCategory}`
      );
    } catch (error) {
      console.error('Error fetching program specific data:', error);
      return {
        orders: [],
        tasks: [],
        resources: []
      };
    }
  }

  /**
   * Create a new patient record
   */
  async createPatient(userData: {
    user_id: string;
    first_name: string;
    last_name?: string;
    email: string;
    date_of_birth?: string;
    weight?: number;
    height?: number;
  }): Promise<PatientProfile | null> {
    try {
      return await apiFetch<PatientProfile>('/patients', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      return null;
    }
  }

  /**
   * Get patient by user_id
   */
  async getPatientByUserId(userId: string): Promise<PatientProfile | null> {
    try {
      return await apiFetch<PatientProfile>(`/patients/by-user/${userId}`);
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  }

  /**
   * Update patient profile
   */
  async updatePatient(userId: string, updates: Partial<PatientProfile>): Promise<boolean> {
    try {
      await apiFetch(`/patients/by-user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return true;
    } catch (error) {
      console.error('Error updating patient:', error);
      return false;
    }
  }
}

// Export a single instance
export const databaseService = new DatabaseService();
