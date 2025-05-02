import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config/constants';

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: { name: string; description: string }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      setProjects(prev => [...prev, response.data]);
      toast.success('Project created successfully');
      return response.data;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Failed to create project');
      throw err;
    }
  };

  const getProjectById = useCallback(async (projectId: string) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching project ${projectId}:`, err);
      toast.error('Failed to load project details');
      throw err;
    }
  }, []);

  const updateProject = async (projectId: string, projectData: Partial<Project>) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${projectId}`, projectData);
      setProjects(prev => 
        prev.map(project => project._id === projectId ? response.data : project)
      );
      toast.success('Project updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`);
      setProjects(prev => prev.filter(project => project._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
  };
};

export default useProjects;