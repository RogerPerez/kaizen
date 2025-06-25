import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskForm } from '../../components/tasks/TaskForm';
import { useUpdateTask } from '../../hooks/useTaskMutations';
import { useTaskStore } from '../../store/taskStore';
import { ArrowLeft, Edit, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TaskEditMicrofrontend: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateTaskMutation = useUpdateTask();
  
  const task = useTaskStore(state => state.getTaskById(id || ''));
  
  const handleSubmit = async (data: any) => {
    if (!task) return;
    
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data
      });
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
  
  if (!task) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Not Found</h2>
          <p className="text-gray-600 mb-4">
            The task you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={handleCancel}
          className="mb-4"
        >
          Back to Task Details
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
            <Edit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
            <p className="text-gray-600">Update task information in your Kaizen workflow</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Currently editing:</h3>
        <p className="text-lg font-semibold text-gray-800">{task.title}</p>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
        )}
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Update Task Details</h2>
          <p className="text-sm text-gray-600">
            Modify the task information below. Changes will be saved immediately upon submission.
          </p>
        </div>
        
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updateTaskMutation.isPending}
        />
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-medium text-amber-900">Kaizen Editing Tips:</h3>
        </div>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Changes are saved to both local state and the JSONPlaceholder API</li>
          <li>• You can update the status directly from the task detail page</li>
          <li>• Use the priority field to help organize your workflow</li>
          <li>• Due dates help you stay on track with deadlines</li>
          <li>• Small improvements compound over time - embrace continuous enhancement</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskEditMicrofrontend;