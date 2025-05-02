import { Calendar, CheckCircle, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Project } from '../../hooks/useProjects';
import useTasks from '../../hooks/useTasks';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { tasks } = useTasks(project._id);
  
  const completedTasks = tasks ? tasks.filter(task => task.status === 'completed').length : 0;
  const totalTasks = tasks ? tasks.length : 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <li>
      <Link 
        to={`/projects/${project._id}`}
        className="block hover:bg-gray-50"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-purple-600 truncate">{project.name}</h4>
            <div className="ml-2 flex-shrink-0 flex">
              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {progress}% Complete
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500 line-clamp-1">
                {project.description || 'No description'}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
              <p>
                Created on <time dateTime={project.createdAt}>{format(new Date(project.createdAt), 'MMM d, yyyy')}</time>
              </p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                {completedTasks} completed
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Circle className="h-4 w-4 text-gray-400 mr-1" />
                {totalTasks - completedTasks} pending
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProjectCard;