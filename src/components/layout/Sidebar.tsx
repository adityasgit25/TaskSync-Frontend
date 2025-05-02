import { HomeIcon, FolderIcon, Settings, X, Plus, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useProjects from '../../hooks/useProjects';
import CreateProjectModal from '../projects/CreateProjectModal';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const { projects, isLoading } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: Settings },
  ];

  useEffect(() => {
    // Close sidebar on mobile when location changes
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } fixed inset-0 z-20 transition-opacity md:hidden`}
        onClick={closeSidebar}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b">
          <Link to="/dashboard" className="text-xl font-bold text-purple-600">TaskSync</Link>
          <button
            className="p-2 text-gray-500 rounded-md md:hidden hover:text-gray-700 focus:outline-none"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col flex-grow px-4 mt-5">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-100'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    location.pathname === item.href ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projects
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                disabled={projects && projects.length >= 4}
                className={`${
                  projects && projects.length >= 4 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-purple-600 hover:text-purple-700'
                } p-1 rounded-full hover:bg-purple-100`}
                title={projects && projects.length >= 4 ? "Maximum 4 projects allowed" : "Create new project"}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="px-3 py-2 text-sm text-gray-500">Loading projects...</div>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className={`${
                      location.pathname === `/projects/${project._id}`
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <FolderIcon
                      className={`${
                        location.pathname === `/projects/${project._id}` ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Layers className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No projects yet</p>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs font-medium text-gray-500 truncate">
                {user?.country || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;