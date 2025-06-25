import { create } from 'zustand';
import { Task } from '../types/task';
import { isTaskUrgent } from '../utils/taskUtils';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  isInitialized: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  getTaskById: (id: string) => Task | undefined;
  getSortedTasks: (sortBy?: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getUrgentTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  isInitialized: false,
  
  setTasks: (tasks) => set({ tasks, isInitialized: true }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ),
    selectedTask: state.selectedTask?.id === id 
      ? { ...state.selectedTask, ...updates, updatedAt: new Date().toISOString() }
      : state.selectedTask
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
  })),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  getTaskById: (id) => get().tasks.find(task => task.id === id),
  
  getSortedTasks: (sortBy = 'smart') => {
    const tasks = get().tasks;
    
    if (sortBy === 'smart') {
      // Smart sorting: IN PROGRESS → TODO → DONE, with urgent tasks first within each status group
      return [...tasks].sort((a, b) => {
        // Group by status: in_progress → todo → done
        const statusOrder = { in_progress: 1, todo: 2, done: 3 };
        const aStatusOrder = statusOrder[a.status];
        const bStatusOrder = statusOrder[b.status];
        
        if (aStatusOrder !== bStatusOrder) {
          return aStatusOrder - bStatusOrder;
        }
        
        // Within the same status group, prioritize urgent tasks
        const aUrgent = isTaskUrgent(a);
        const bUrgent = isTaskUrgent(b);
        
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        
        // If both are urgent or both are not urgent, sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriorityValue = priorityOrder[a.priority];
        const bPriorityValue = priorityOrder[b.priority];
        
        if (aPriorityValue !== bPriorityValue) {
          return bPriorityValue - aPriorityValue;
        }
        
        // Same priority and urgency: sort by due date, then by updated time
        if (a.dueDate && b.dueDate) {
          const dueDateDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          if (dueDateDiff !== 0) return dueDateDiff;
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    }
    
    let sorted = [...tasks];
    
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
        
      case 'dueDate':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
        
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
        
      case 'updated':
      default:
        sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }
    
    return sorted;
  },
  
  getTasksByStatus: (status) => {
    const tasks = get().tasks;
    return tasks.filter(task => task.status === status);
  },
  
  getTasksByPriority: (priority) => {
    const tasks = get().tasks;
    return tasks.filter(task => task.priority === priority);
  },
  
  getUrgentTasks: () => {
    const tasks = get().tasks;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate <= threeDaysFromNow && dueDate >= now;
    });
  }
}));