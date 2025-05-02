import { Link } from 'react-router-dom';
import { Plus, FolderIcon, Layers } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import useAuth from '../hooks/useAuth';
import ProjectCard from '../components/projects/ProjectCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, isLoading, fetchProjects } = useProjects();

  // useEffect(() => {
  //   fetchProjects();
  // }, [fetchProjects]);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your projects and tasks all in one place
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View Profile
          </Link>
          {projects && projects.length < 4 ? (
            <Link
              to="#"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('create-project-btn')?.click();
              }}
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Project
            </Link>
          ) : null}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Projects
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            You can have up to 4 active projects
          </p>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : projects && projects.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new project.
            </p>
            {projects && projects.length < 4 && (
              <div className="mt-6">
                <button
                  id="create-project-btn"
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => {
                    // Open create project modal from the sidebar
                    document.getElementById('sidebar-create-project-btn')?.click();
                  }}
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-sm text-gray-500">Your recent activity will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;