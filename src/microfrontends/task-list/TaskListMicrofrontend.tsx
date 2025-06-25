import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { Task } from '../../types/task';
import { TaskList } from '../../components/tasks/TaskList';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useTaskStore } from '../../store/taskStore';
import { useTasks } from '../../hooks/useTasks';
import { useDeleteTask } from '../../hooks/useTaskMutations';
import { getTaskStats } from '../../utils/taskUtils';
import { isTaskUrgent } from '../../utils/taskUtils';

const TaskListMicrofrontend: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('smart');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  const allTasks = useTaskStore(state => state.tasks);
  const getSortedTasks = useTaskStore(state => state.getSortedTasks);
  const isInitialized = useTaskStore(state => state.isInitialized);
  const { isLoading, error } = useTasks();
  const deleteTaskMutation = useDeleteTask();
  
  const filteredTasks = React.useMemo(() => {
    const sortedTasks = getSortedTasks(sortBy);
    
    let filtered = sortedTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      let matchesPriority = true;
      if (priorityFilter === 'urgent') {
        matchesPriority = isTaskUrgent(task) && task.status !== 'done';
      } else if (priorityFilter !== 'all') {
        matchesPriority = task.priority === priorityFilter;
      }
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    return filtered;
  }, [allTasks, getSortedTasks, sortBy, searchTerm, statusFilter, priorityFilter]);
  
  const stats = getTaskStats(allTasks);
  
  const handleViewTask = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };
  
  const handleEditTask = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };
  
  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTaskMutation.mutateAsync(taskToDelete.id);
        setShowDeleteConfirm(false);
        setTaskToDelete(null);
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];
  
  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: '🚨 Urgent Tasks' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'smart', label: 'Kaizen Smart Sort (Status → Urgent → Priority)' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'title', label: 'Title' }
  ];
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Tasks</h2>
          <p className="text-gray-600 mb-4">
            Unable to fetch tasks from JSONPlaceholder. Please check your internet connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Kaizen Dashboard</h2>
                <p className="text-gray-600">
                  Continuous improvement through smart task management • JSONPlaceholder API
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/tasks/create')}
            disabled={isLoading && !isInitialized}
            size="lg"
          >
            Create New Task
          </Button>
        </div>
        
        {/* Enhanced Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Active workflow management
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Currently being worked on
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.done}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <ProgressBar 
              value={stats.done} 
              max={stats.total} 
              color="green" 
              size="sm"
            />
            <div className="text-xs text-gray-500 mt-1">
              {stats.completionRate}% completion rate
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
                <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.urgent > 0 ? 'Requires immediate attention' : 'All tasks on track'}
            </div>
          </div>
        </div>

        {/* Kaizen Progress Indicator */}
        {stats.total > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Kaizen Progress</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Overall Completion</span>
                  <span className="font-medium text-gray-900">{stats.completionRate}%</span>
                </div>
                <ProgressBar 
                  value={stats.done} 
                  max={stats.total} 
                  color="green" 
                  size="md"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Active Work</span>
                  <span className="font-medium text-gray-900">
                    {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  value={stats.inProgress} 
                  max={stats.total} 
                  color="purple" 
                  size="md"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pending Tasks</span>
                  <span className="font-medium text-gray-900">
                    {stats.total > 0 ? Math.round((stats.todo / stats.total) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  value={stats.todo} 
                  max={stats.total} 
                  color="blue" 
                  size="md"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
          
          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredTasks.length} of {stats.total} tasks
                {searchTerm && ` matching "${searchTerm}"`}
                {priorityFilter === 'urgent' && ' (urgent tasks only)'}
                {priorityFilter !== 'all' && priorityFilter !== 'urgent' && ` (${priorityFilter} priority)`}
              </p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-700">Kaizen Sorting:</span>
              <span className="text-gray-600">
                {sortBy === 'smart' 
                  ? '🟣 In Progress → 📋 To Do → ✅ Done | Within each group: 🚨 Urgent → High → Medium → Low priority'
                  : `${sortOptions.find(opt => opt.value === sortBy)?.label} order`
                }
              </span>
            </div>
            
            {priorityFilter === 'urgent' && (
              <div className="flex items-center gap-2 text-sm mt-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-700">Filter Active:</span>
                <span className="text-red-600">
                  Showing only urgent tasks (due within 3 days, excluding completed)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <TaskList
        tasks={filteredTasks}
        loading={isLoading && !isInitialized}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onViewTask={handleViewTask}
        onCreateTask={() => navigate('/tasks/create')}
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
              Are you sure you want to delete "{taskToDelete?.title}"?
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            This action cannot be undone.
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

export default TaskListMicrofrontend;