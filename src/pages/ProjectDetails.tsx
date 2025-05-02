import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListPlus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import useProjects, { Project } from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal';
import ProjectEditModal from '../components/projects/ProjectEditModal';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, deleteProject } = useProjects();
  const { tasks, isLoading: isTasksLoading, fetchTasks } = useTasks(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, getProjectById]);

  const handleDeleteProject = async () => {
    if (!projectId) return;
    
    try {
      await deleteProject(projectId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {project.name}
            </h2>
            {project.description && (
              <p className="mt-1 text-sm text-gray-500 max-w-3xl">
                {project.description}
              </p>
            )}
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Edit2 className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tasks
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage tasks for this project
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ListPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Task
          </button>
        </div>
        
        <TaskList 
          tasks={tasks || []} 
          isLoading={isTasksLoading} 
          projectId={projectId || ''} 
        />
      </div>

      {/* Task Create Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId || ''}
        onTaskCreated={fetchTasks}
      />

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onProjectUpdated={handleProjectUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and will delete all associated tasks."
      />
    </div>
  );
};

export default ProjectDetails;