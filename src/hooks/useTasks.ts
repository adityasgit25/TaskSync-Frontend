import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/constants';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  projectId: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
};

const useTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createTask = async (taskData: TaskFormData) => {
    if (!projectId) return null;
    
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, taskData);
      setTasks(prev => [...prev, response.data]);
      toast.success('Task created successfully');
      return response.data;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<TaskFormData>) => {
    if (!projectId) return null;
    
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}`, taskData);
      setTasks(prev => 
        prev.map(task => task._id === taskId ? response.data : task)
      );
      toast.success('Task updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!projectId) return;
    
    try {
      await axios.delete(`${API_URL}/projects/${projectId}/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      throw err;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [projectId, fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};

export default useTasks;