import React from 'react';
import { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useTaskStore } from '../../store/taskStore';
import { Package, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onCreateTask?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onCreateTask
}) => {
  const isInitialized = useTaskStore(state => state.isInitialized);
  
  if (loading && !isInitialized) {
    return (
      <div className="flex justify-center items-center py-16 min-h-[400px]">
        <div className="text-center flex flex-col items-center">
          <LoadingSpinner size="lg" color="blue" />
          <p className="text-gray-500 mt-4 text-lg">Loading your tasks from JSONPlaceholder...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching first 20 tasks</p>
        </div>
      </div>
    );
  }
  
  if (tasks.length === 0 && isInitialized) {
    return (
      <div className="flex justify-center items-center py-16 min-h-[400px]">
        <div className="text-center flex flex-col items-center max-w-md">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            You don't have any tasks yet. Create your first task to get started with your Kaizen productivity journey and begin your continuous improvement process.
          </p>
          {onCreateTask && (
            <Button icon={Plus} onClick={onCreateTask} size="lg">
              Create Your First Task
            </Button>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Kaizen Tip:</span>
            </div>
            <p className="text-sm text-blue-800">
              Start small and improve continuously. Even the longest journey begins with a single step.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Task Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onView={onViewTask}
          />
        ))}
      </div>

      {/* Summary Footer */}
      {tasks.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Showing {tasks.length} tasks</span>
            </div>
            <div className="text-right">
              <span className="font-medium">Kaizen Philosophy:</span>
              <span className="ml-1">Continuous improvement through organized action</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};