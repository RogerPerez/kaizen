import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer: React.FC = () => {
  const notifications = useNotificationStore(state => state.notifications);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-md pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};