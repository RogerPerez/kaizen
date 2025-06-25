import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../../components/tasks/TaskForm';
import { useCreateTask } from '../../hooks/useTaskMutations';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const TaskCreateMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const createTaskMutation = useCreateTask();
  
  const handleSubmit = async (data: any) => {
    try {
      const newTask = await createTaskMutation.mutateAsync(data);
      navigate(`/tasks/${newTask.id}`);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={handleCancel}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
            <p className="text-gray-600">Add a new task to your Kaizen workflow</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Task Details</h2>
          <p className="text-sm text-gray-600">
            Fill in the information below to create your new task. All fields marked with * are required.
          </p>
        </div>
        
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createTaskMutation.isPending}
        />
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-900">Kaizen Tips for Effective Tasks:</h3>
        </div>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use clear, actionable titles that describe what needs to be done</li>
          <li>• Add detailed descriptions to provide context and requirements</li>
          <li>• Set realistic due dates to help prioritize your work</li>
          <li>• Choose appropriate priority levels based on urgency and importance</li>
          <li>• Remember: Small, continuous improvements lead to big results</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskCreateMicrofrontend;