import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Clock, Trash2, Edit } from 'lucide-react';
import { Task, TaskStatus } from '../../hooks/useTasks';
import useTasks from '../../hooks/useTasks';
import LoadingSpinner from '../ui/LoadingSpinner';
import TaskModal from './TaskModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  projectId: string;
}

const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let Icon = Circle;

  switch (status) {
    case 'pending':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      Icon = Circle;
      break;
    case 'in-progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      Icon = Clock;
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      Icon = CheckCircle;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      Icon = Circle;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, projectId }) => {
  const { updateTask, deleteTask } = useTasks(projectId);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        setTaskToDelete(null);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="px-4 py-12 text-center sm:px-6">
        <p className="text-sm text-gray-500">No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                    handleStatusChange(task._id, newStatus);
                  }}
                  className={`mr-3 flex-shrink-0 h-5 w-5 rounded-full focus:outline-none ${
                    task.status === 'completed' ? 'text-green-500' : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <p className={`text-sm font-medium text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 flex items-center">
                <TaskStatusBadge status={task.status} />
                <div className="ml-4 flex items-center">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirmDeleteTask(task._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <p>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                {task.completedAt && (
                  <p>Completed: {format(new Date(task.completedAt), 'MMM d, yyyy')}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        projectId={projectId}
        task={editingTask || undefined}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
};

export default TaskList;