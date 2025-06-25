import { Task, CreateTaskData } from '../types/task';

export const isTaskUrgent = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'done') return false;
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 3 && diffDays >= 0;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'todo':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'in_progress':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'done':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const validateTask = (data: Partial<CreateTaskData>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (data.title && data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  
  if (data.title && data.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  
  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (dueDate < now) {
      errors.dueDate = 'Due date must be today or in the future';
    }
  }
  
  return errors;
};

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const urgent = tasks.filter(isTaskUrgent).length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  
  return {
    total,
    todo,
    inProgress,
    done,
    urgent,
    highPriority,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0
  };
};

export const getProductivityInsights = (tasks: Task[]) => {
  const stats = getTaskStats(tasks);
  const insights = [];
  
  if (stats.urgent > 0) {
    insights.push({
      type: 'warning' as const,
      message: `You have ${stats.urgent} urgent task${stats.urgent > 1 ? 's' : ''} requiring immediate attention.`,
      action: 'Focus on urgent tasks first to prevent delays.'
    });
  }
  
  if (stats.inProgress > stats.todo && stats.todo > 0) {
    insights.push({
      type: 'info' as const,
      message: 'You have more tasks in progress than pending.',
      action: 'Consider completing current tasks before starting new ones.'
    });
  }
  
  if (stats.completionRate >= 80) {
    insights.push({
      type: 'success' as const,
      message: `Excellent progress! ${stats.completionRate}% completion rate.`,
      action: 'Keep up the great work and maintain this momentum.'
    });
  } else if (stats.completionRate < 30 && stats.total > 5) {
    insights.push({
      type: 'warning' as const,
      message: `Low completion rate (${stats.completionRate}%). Consider breaking down large tasks.`,
      action: 'Apply Kaizen principles: small, continuous improvements.'
    });
  }
  
  if (stats.highPriority > 0 && stats.inProgress === 0) {
    insights.push({
      type: 'info' as const,
      message: `You have ${stats.highPriority} high-priority task${stats.highPriority > 1 ? 's' : ''} waiting.`,
      action: 'Consider starting work on high-priority items.'
    });
  }
  
  return insights;
};

export const getKaizenRecommendations = (tasks: Task[]) => {
  const stats = getTaskStats(tasks);
  const recommendations = [];
  
  if (stats.total === 0) {
    recommendations.push({
      title: 'Start Your Kaizen Journey',
      description: 'Begin with creating your first task. Small steps lead to big improvements.',
      priority: 'high' as const
    });
  }
  
  if (stats.urgent > 3) {
    recommendations.push({
      title: 'Reduce Urgent Tasks',
      description: 'Too many urgent tasks indicate poor planning. Schedule regular reviews.',
      priority: 'high' as const
    });
  }
  
  if (stats.inProgress > 5) {
    recommendations.push({
      title: 'Limit Work in Progress',
      description: 'Focus on completing tasks rather than starting new ones.',
      priority: 'medium' as const
    });
  }
  
  if (stats.completionRate < 50 && stats.total > 3) {
    recommendations.push({
      title: 'Break Down Large Tasks',
      description: 'Smaller tasks are easier to complete and provide more frequent wins.',
      priority: 'medium' as const
    });
  }
  
  return recommendations;
};