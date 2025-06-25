import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Plus, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/taskStore';
import { env } from '../../config/env';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tasks = useTaskStore(state => state.tasks);
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const pendingTasks = tasks.filter(task => task.status !== 'done').length;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{env.appName}</h1>
              <p className="text-xs text-gray-500">
                Continuous Improvement • v{env.appVersion}
              </p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'primary' : 'ghost'}
              size="sm"
              icon={Home}
              onClick={() => navigate('/')}
            >
              Dashboard
              {pendingTasks > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {pendingTasks}
                </span>
              )}
            </Button>
            
            <Button
              variant={isActive('/tasks/create') ? 'primary' : 'ghost'}
              size="sm"
              icon={Plus}
              onClick={() => navigate('/tasks/create')}
            >
              Create Task
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};