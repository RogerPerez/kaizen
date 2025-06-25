import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const removeNotification = useNotificationStore(state => state.removeNotification);
  
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800'
  };
  
  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-amber-400'
  };
  
  const Icon = icons[notification.type];
  
  return (
    <div className={`w-full max-w-md border rounded-lg shadow-lg p-4 ${colors[notification.type]} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={`h-5 w-5 ${iconColors[notification.type]}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-5 break-words">
            {notification.title}
          </p>
          {notification.message && (
            <p className="mt-1 text-sm opacity-90 leading-5 break-words">
              {notification.message}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <button
            className="inline-flex text-current hover:opacity-75 transition-opacity p-1 rounded-md hover:bg-black/5"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};