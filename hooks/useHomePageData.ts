import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databaseService, HomePageData } from '../services/databaseService';

export const useHomePageData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const homePageData = await databaseService.getHomePageData(user);
      setData(homePageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const refreshData = () => {
    fetchData();
  };

  const logWeight = async (weight: number) => {
    if (!data?.profile.id) return false;
    
    const success = await databaseService.logWeight(data.profile.id, weight);
    if (success) {
      refreshData(); // Refresh all data after logging weight
    }
    return success;
  };

  const completeTask = async (taskId: string) => {
    const success = await databaseService.completeTask(taskId);
    if (success) {
      refreshData(); // Refresh all data after completing task
    }
    return success;
  };

  const getProgramData = async (programCategory: string) => {
    if (!data?.profile.id) return { orders: [], tasks: [], resources: [] };
    return await databaseService.getProgramSpecificData(data.profile.id, programCategory);
  };

  return {
    data,
    loading,
    error,
    refreshData,
    logWeight,
    completeTask,
    getProgramData
  };
};
