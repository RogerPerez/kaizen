import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { MicrofrontendRouter } from './MicrofrontendRouter';
import { NotificationContainer } from '../../components/notifications/NotificationContainer';
import { TaskInitializer } from './TaskInitializer';
import { Header } from './Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export const ShellApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <TaskInitializer />
          <Header />
          
          <main className="flex-1">
            <MicrofrontendRouter />
          </main>
          
          <NotificationContainer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};