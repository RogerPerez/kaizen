import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/tasks/TaskForm';
import { useUpdateTask } from '../hooks/useTaskMutations';
import { useTaskStore } from '../store/taskStore';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TaskEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateTaskMutation = useUpdateTask();
  
  // Read directly from Zustand store
  const task = useTaskStore(state => state.getTaskById(id || ''));
  
  const handleSubmit = async (data: any) => {
    if (!task) return;
    
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data
      });
      // Navigate back to detail page after successful update
      navigate(`/tasks/${task.id}`);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };
  
  const handleCancel = () => {
    if (task) {
      navigate(`/tasks/${task.id}`);
    } else {
      navigate('/');
    }
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={handleCancel}
            className="mb-4"
          >
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Task</h1>
          <p className="text-gray-600">Update your task details</p>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={updateTaskMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};