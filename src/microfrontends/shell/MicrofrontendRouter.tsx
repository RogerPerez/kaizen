import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const TaskListMicrofrontend = React.lazy(() => import('../task-list/TaskListMicrofrontend'));
const TaskDetailMicrofrontend = React.lazy(() => import('../task-detail/TaskDetailMicrofrontend'));
const TaskEditMicrofrontend = React.lazy(() => import('../task-edit/TaskEditMicrofrontend'));
const TaskCreateMicrofrontend = React.lazy(() => import('../task-create/TaskCreateMicrofrontend'));

export const MicrofrontendRouter: React.FC = () => {
  const LoadingFallback = () => (
    <div className="flex justify-center items-center py-16">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 mt-4">Loading microfrontend...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<TaskListMicrofrontend />} />
        <Route path="/tasks/create" element={<TaskCreateMicrofrontend />} />
        <Route path="/tasks/:id" element={<TaskDetailMicrofrontend />} />
        <Route path="/tasks/:id/edit" element={<TaskEditMicrofrontend />} />
        <Route 
          path="*" 
          element={
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600">The requested microfrontend could not be found.</p>
            </div>
          } 
        />
      </Routes>
    </Suspense>
  );
};