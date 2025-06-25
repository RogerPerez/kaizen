import { Task, CreateTaskData, UpdateTaskData } from '../types/task';
import { env } from '../config/env';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Transform JSONPlaceholder todo to our Task format
const transformTodo = (todo: any): Task => ({
  id: todo.id.toString(),
  title: todo.title,
  description: `Task from JSONPlaceholder - ID: ${todo.id}`,
  dueDate: undefined,
  priority: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
  status: todo.completed ? 'done' : Math.random() > 0.5 ? 'in_progress' : 'todo',
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
});

const mapStatusToCompleted = (status: Task['status']): boolean => {
  return status === 'done';
};

const mapStatusToDescription = (status: Task['status']): string => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'done':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    await delay(800);
    
    try {
      const response = await fetch(`${env.apiBaseUrl}/todos?_limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const todos = await response.json();
      return todos.map(transformTodo);
    } catch (error) {
      throw new Error('Failed to fetch tasks from server');
    }
  },

  createTask: async (data: CreateTaskData): Promise<void> => {
    await delay(600);
    
    try {
      const response = await fetch(`${env.apiBaseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          body: data.description || `Priority: ${data.priority}${data.dueDate ? `, Due: ${data.dueDate}` : ''}`,
          userId: 1,
          completed: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      throw new Error('Failed to create task on server');
    }
  },

  updateTask: async (id: string, data: UpdateTaskData): Promise<void> => {
    await delay(500);
    
    try {
      const requestBody: any = {
        userId: 1
      };

      if (data.title !== undefined) {
        requestBody.title = data.title;
      }

      if (data.description !== undefined || data.priority !== undefined || data.dueDate !== undefined) {
        let bodyParts = [];
        
        if (data.description) {
          bodyParts.push(data.description);
        }
        
        if (data.priority) {
          bodyParts.push(`Priority: ${data.priority}`);
        }
        
        if (data.dueDate) {
          bodyParts.push(`Due: ${data.dueDate}`);
        }
        
        if (data.status) {
          bodyParts.push(`Status: ${mapStatusToDescription(data.status)}`);
        }
        
        requestBody.body = bodyParts.join(' | ');
      }

      if (data.status !== undefined) {
        requestBody.completed = mapStatusToCompleted(data.status);
      }

      const response = await fetch(`${env.apiBaseUrl}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      throw new Error('Failed to update task on server');
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(400);
    
    try {
      const response = await fetch(`${env.apiBaseUrl}/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      throw new Error('Failed to delete task on server');
    }
  }
};