import { supabase } from '../lib/supabase';

export interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  weight_current: number;
  weight_goal: number;
  weight_start: number;
  height: number;
  created_at: string;
  updated_at: string;
}

export interface PatientOrder {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refill_date: string;
  status: string;
  instructions: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  patient_id: string;
  weight: number;
  notes: string;
  scheduled_date: string;
  completed_date: string | null;
  created_at: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  reading_time_minutes: number;
  is_featured: boolean;
  image_url: string | null;
  created_at: string;
}

export interface PbTask {
  id: string;
  patient_id: string;
  task_type: string;
  title: string;
  description: string;
  due_date: string;
  completed_date: string | null;
  status: string;
  medication_name: string | null;
  dosage: string | null;
  created_at: string;
}

// Get current patient profile
export const getCurrentPatientProfile = async (userId: string): Promise<PatientProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching patient profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCurrentPatientProfile:', error);
    return null;
  }
};

// Get active patient orders (medications)
export const getActivePatientOrders = async (patientId: string): Promise<PatientOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('patient_orders')
      .select('*')
      .eq('patient_id', patientId)
      .in('status', ['active', 'ordered', 'shipped'])
      .order('refill_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching patient orders:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getActivePatientOrders:', error);
    return [];
  }
};

// Get upcoming check-ins
export const getUpcomingCheckIns = async (patientId: string): Promise<CheckIn[]> => {
  try {
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('patient_id', patientId)
      .is('completed_date', null)
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true })
      .limit(5);
    
    if (error) {
      console.error('Error fetching check-ins:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUpcomingCheckIns:', error);
    return [];
  }
};

// Get featured educational resources
export const getFeaturedEducationalResources = async (): Promise<EducationalResource[]> => {
  try {
    const { data, error } = await supabase
      .from('educational_resources')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching educational resources:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeaturedEducationalResources:', error);
    return [];
  }
};

// Get current tasks for patient
export const getCurrentPatientTasks = async (patientId: string): Promise<PbTask[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('pb_tasks')
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'pending')
      .lte('due_date', today)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching patient tasks:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getCurrentPatientTasks:', error);
    return [];
  }
};

// Calculate weight progress
export const calculateWeightProgress = (current: number, start: number, goal: number) => {
  const totalToLose = start - goal;
  const lostSoFar = start - current;
  const progressPercentage = Math.round((lostSoFar / totalToLose) * 100);
  const remaining = current - goal;
  
  return {
    progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
    lostSoFar,
    remaining: Math.max(0, remaining),
    weeklyChange: 0 // This would need historical data to calculate
  };
};

// Mark task as completed
export const markTaskCompleted = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pb_tasks')
      .update({ 
        status: 'completed',
        completed_date: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (error) {
      console.error('Error marking task as completed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markTaskCompleted:', error);
    return false;
  }
};

// Add weight log entry
export const logWeight = async (patientId: string, weight: number, notes?: string): Promise<boolean> => {
  try {
    // Update current weight in patients table
    const { error: updateError } = await supabase
      .from('patients')
      .update({ 
        weight_current: weight,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId);
    
    if (updateError) {
      console.error('Error updating patient weight:', updateError);
      return false;
    }
    
    // Add weight log entry (assuming there's a weight_logs table)
    const { error: logError } = await supabase
      .from('weight_logs')
      .insert({
        patient_id: patientId,
        weight: weight,
        notes: notes || '',
        logged_date: new Date().toISOString()
      });
    
    if (logError) {
      console.error('Error logging weight:', logError);
      // Don't return false here as the main update succeeded
    }
    
    return true;
  } catch (error) {
    console.error('Error in logWeight:', error);
    return false;
  }
};
