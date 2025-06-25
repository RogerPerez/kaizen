import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTaskMutations';
import { useTaskStore } from '../../store/taskStore';
import { Task } from '../../types/task';
import { AlertTriangle, Eye, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

const TaskDetailMicrofrontend: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  
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
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (task) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        setShowDeleteConfirm(false);
        navigate('/');
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
            <p className="text-gray-600">View and manage task information in your Kaizen workflow</p>
          </div>
        </div>
      </div>
      
      <TaskDetail
        task={task}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
        onStatusChange={handleStatusChange}
        loading={updateTaskMutation.isPending}
      />
      
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-gray-700">
              Are you sure you want to delete "{task?.title}"?
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            This action cannot be undone and you will be redirected to the dashboard.
          </p>
          
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteTaskMutation.isPending}
              disabled={deleteTaskMutation.isPending}
            >
              Delete Task
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteTaskMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailMicrofrontend;