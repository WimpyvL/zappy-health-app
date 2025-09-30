import { apiFetch } from './apiClient';
import type {
  Appointment,
  CheckIn,
  EducationalResource,
  HomePageData,
  Patient,
  PatientInsert,
  PatientOrder,
  PatientUpdate,
  Task,
  Profile,
  ProfileInsert,
  ProfileUpdate,
} from '../types/api';

export type { HomePageData } from '../types/api';

/**
 * Centralized Database Service
 * Single entry point for all database operations
 */
class DatabaseService {
  /**
   * Get all data needed for the HomePage in a single call
   */
  async getHomePageData(): Promise<HomePageData | null> {
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
  async logWeight(_patientId: string, weight: number): Promise<boolean> {
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
  async getPatientPrograms(_patientId: string) {
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
  async getProgramSpecificData(_patientId: string, programCategory: string) {
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
  async createPatient(userData: PatientInsert): Promise<Patient | null> {
    try {
      return await apiFetch<Patient>('/patients', {
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
  async getPatientByUserId(userId: string): Promise<Patient | null> {
    try {
      return await apiFetch<Patient>(`/patients/by-user/${userId}`);
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  }

  /**
   * Update patient profile
   */
  async updatePatient(userId: string, updates: PatientUpdate): Promise<boolean> {
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
  /**
   * Profile helpers
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      return await apiFetch<Profile>(`/profiles/${userId}`);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async createProfile(profile: ProfileInsert): Promise<Profile | null> {
    try {
      return await apiFetch<Profile>('/profiles', {
        method: 'POST',
        body: JSON.stringify(profile),
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<boolean> {
    try {
      await apiFetch(`/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }
}

// Export a single instance
export const databaseService = new DatabaseService();
