import React, { useState } from 'react';
import { Task } from '../../types/task';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  ArrowLeft,
  User,
  Flag
} from 'lucide-react';
import { 
  isTaskUrgent, 
  formatDate, 
  formatDateTime 
} from '../../utils/taskUtils';

interface TaskDetailProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onBack: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  loading?: boolean;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  onEdit,
  onDelete,
  onBack,
  onStatusChange,
  loading = false
}) => {
  const [statusChanging, setStatusChanging] = useState(false);
  const isUrgent = isTaskUrgent(task);
  
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];
  
  const handleStatusChange = async (newStatus: string) => {
    setStatusChanging(true);
    try {
      await onStatusChange(task.id, newStatus as Task['status']);
    } finally {
      setStatusChanging(false);
    }
  };

  const getHeaderStyles = () => {
    switch (task.status) {
      case 'done':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-purple-50 border-purple-200';
      case 'todo':
        return isUrgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCardBorderStyles = () => {
    switch (task.status) {
      case 'done':
        return 'border-green-200';
      case 'in_progress':
        return 'border-purple-300';
      case 'todo':
        return isUrgent ? 'border-red-300' : 'border-blue-200';
      default:
        return 'border-gray-200';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={onBack}
          className="mb-4"
        >
          Back to Tasks
        </Button>
      </div>
      
      <div className={`bg-white rounded-lg border-2 shadow-sm ${getCardBorderStyles()}`}>
        {/* Status Indicator Bar */}
        <div className={`h-2 rounded-t-lg ${
          task.status === 'done' ? 'bg-green-400' :
          task.status === 'in_progress' ? 'bg-purple-400' :
          isUrgent ? 'bg-red-400' : 'bg-blue-400'
        }`} />

        {/* Header */}
        <div className={`p-6 border-b ${getHeaderStyles()}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className={`text-2xl font-bold text-gray-900 ${task.status === 'done' ? 'line-through' : ''}`}>
                  {task.title}
                </h1>
                {isUrgent && task.status !== 'done' && (
                  <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    options={statusOptions}
                    disabled={statusChanging}
                    className="text-sm"
                  />
                  {statusChanging && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  )}
                </div>

                {isUrgent && task.status !== 'done' && (
                  <Badge variant="error" size="sm" className="animate-pulse">
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={Edit}
                onClick={() => onEdit(task)}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => onDelete(task)}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Description */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              {task.description ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>
            
            {/* Due Date */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Due Date</h3>
              {task.dueDate ? (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isUrgent && task.status !== 'done' && (
                    <Badge variant="error" size="sm" className="animate-pulse">
                      Urgent
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No due date set</p>
              )}
            </div>
            
            {/* Timestamps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Created: {formatDateTime(task.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {formatDateTime(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};