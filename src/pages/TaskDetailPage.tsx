import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskDetail } from '../components/tasks/TaskDetail';
import { useUpdateTask } from '../hooks/useTaskMutations';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateTaskMutation = useUpdateTask();
  
  // Read directly from Zustand store - this will auto-update when state changes
  const task = useTaskStore(state => state.getTaskById(id || ''));
  
  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status }
      });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };
  
  const handleEdit = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };
  
  const handleDelete = (task: Task) => {
    // This would trigger a delete confirmation modal
    // For now, we'll just navigate back
    navigate('/');
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  // If task doesn't exist, show error
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">
            The task you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TaskDetail
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
          onStatusChange={handleStatusChange}
          loading={updateTaskMutation.isPending}
        />
      </div>
    </div>
  );
};