import React from 'react';
import { Calendar, Clock, AlertTriangle, Edit, Trash2, Flag, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Task } from '../../types/task';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { isTaskUrgent, formatDate, formatRelativeTime } from '../../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onView
}) => {
  const isUrgent = isTaskUrgent(task);
  
  const getStatusIcon = () => {
    switch (task.status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Circle className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getStatusLabel = () => {
    switch (task.status) {
      case 'done':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'To Do';
    }
  };

  const getCardStyles = () => {
    let baseStyles = "bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group";
    
    // Status-based border and background styling
    switch (task.status) {
      case 'done':
        return `${baseStyles} border-2 border-green-200 bg-green-50/30 opacity-75`;
      case 'in_progress':
        return `${baseStyles} border-2 border-purple-300 bg-purple-50/40 hover:border-purple-400`;
      case 'todo':
        if (isUrgent) {
          return `${baseStyles} border-2 border-red-300 bg-red-50/40 hover:border-red-400`;
        }
        return `${baseStyles} border-2 border-blue-200 bg-blue-50/20 hover:border-blue-300`;
      default:
        return `${baseStyles} border-2 border-gray-200 hover:border-gray-300`;
    }
  };

  const getStatusBadgeVariant = () => {
    switch (task.status) {
      case 'done':
        return 'success';
      case 'in_progress':
        return 'secondary';
      default:
        return 'primary';
    }
  };
  
  return (
    <div 
      className={getCardStyles()}
      onClick={() => onView(task)}
    >
      {/* Status Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${
        task.status === 'done' ? 'bg-green-400' :
        task.status === 'in_progress' ? 'bg-purple-400' :
        isUrgent ? 'bg-red-400' : 'bg-blue-400'
      }`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pt-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <h3 className={`text-lg font-semibold text-gray-900 truncate ${task.status === 'done' ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {isUrgent && task.status !== 'done' && (
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge 
              variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
              size="sm"
            >
              <Flag className="h-3 w-3 mr-1" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            <Badge 
              variant={getStatusBadgeVariant()}
              size="sm"
            >
              {getStatusLabel()}
            </Badge>
            
            {isUrgent && task.status !== 'done' && (
              <Badge variant="error" size="sm" className="animate-pulse">
                Urgent
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-blue-600"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onDelete(task)}
            className="text-gray-500 hover:text-red-600"
          />
        </div>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isUrgent && task.status !== 'done' ? 'text-red-600 font-medium' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatRelativeTime(task.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};