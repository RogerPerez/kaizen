import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Task } from '../types/task';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useTaskStore } from '../store/taskStore';
import { useTasks } from '../hooks/useTasks';
import { useCreateTask, useDeleteTask } from '../hooks/useTaskMutations';
import { getTaskStats } from '../utils/taskUtils';

export const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('smart');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  // Get tasks directly from store and hook
  const allTasks = useTaskStore(state => state.tasks);
  const getSortedTasks = useTaskStore(state => state.getSortedTasks);
  const isInitialized = useTaskStore(state => state.isInitialized);
  const { isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();
  
  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    // Get sorted tasks from Zustand
    const sortedTasks = getSortedTasks(sortBy);
    
    // Apply filters
    let filtered = sortedTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    // ALWAYS ensure done tasks are at the end, regardless of other sorting
    // Separate done and non-done tasks
    const doneTasks = filtered.filter(task => task.status === 'done');
    const nonDoneTasks = filtered.filter(task => task.status !== 'done');
    
    // Return non-done tasks first, then done tasks
    return [...nonDoneTasks, ...doneTasks];
  }, [allTasks, getSortedTasks, sortBy, searchTerm, statusFilter, priorityFilter]);
  
  const stats = getTaskStats(allTasks);
  
  const handleCreateTask = async (data: any) => {
    try {
      await createTaskMutation.mutateAsync(data);
      setShowCreateForm(false);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };
  
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
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'smart', label: 'Smart Sort (Priority + Urgent)' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'title', label: 'Title' }
  ];
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
              <p className="text-gray-600 text-lg">
                Manage your tasks efficiently • Data from JSONPlaceholder
              </p>
            </div>
            <Button
              icon={Plus}
              onClick={() => setShowCreateForm(true)}
              disabled={isLoading && !isInitialized}
              size="lg"
            >
              Create Task
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.done}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
                  <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters */}
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
                </p>
              </div>
            )}
            
            {/* Sort explanation */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-gray-700">Sorting:</span>
                <span className="text-gray-600">
                  {sortBy === 'smart' 
                    ? 'High priority → Urgent → Medium → Low priority, then completed tasks at the end'
                    : `${sortOptions.find(opt => opt.value === sortBy)?.label} order, with completed tasks always at the end`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={isLoading && !isInitialized}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onViewTask={handleViewTask}
          onCreateTask={() => setShowCreateForm(true)}
        />
        
        {/* Create Task Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
            loading={createTaskMutation.isPending}
          />
        </Modal>
        
        {/* Delete Confirmation Modal */}
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
    </div>
  );
};