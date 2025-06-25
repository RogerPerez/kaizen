import { useMutation } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { useTaskStore } from '../store/taskStore';
import { useNotificationStore } from '../store/notificationStore';
import { CreateTaskData, UpdateTaskData, Task } from '../types/task';

export const useCreateTask = () => {
  const addTask = useTaskStore(state => state.addTask);
  const addNotification = useNotificationStore(state => state.addNotification);

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      // Create the task object immediately for Zustand
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: data.title,
        description: data.description || '',
        dueDate: data.dueDate,
        priority: data.priority,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update Zustand immediately (optimistic update)
      addTask(newTask);

      // Fire and forget API call
      try {
        await taskApi.createTask(data);
      } catch (error) {
        // If API fails, we keep the optimistic update but show a warning
        addNotification({
          type: 'warning',
          title: 'Task created locally',
          message: 'Task was created but may not sync to server'
        });
        throw error;
      }

      return newTask;
    },
    onSuccess: (newTask) => {
      addNotification({
        type: 'success',
        title: 'Task created',
        message: `"${newTask.title}" has been created successfully`
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create task',
        message: error.message
      });
    }
  });
};

export const useUpdateTask = () => {
  const updateTask = useTaskStore(state => state.updateTask);
  const addNotification = useNotificationStore(state => state.addNotification);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskData }) => {
      // Update Zustand immediately (optimistic update)
      updateTask(id, data);

      // Fire and forget API call
      try {
        await taskApi.updateTask(id, data);
      } catch (error) {
        // If API fails, we keep the optimistic update but show a warning
        addNotification({
          type: 'warning',
          title: 'Task updated locally',
          message: 'Task was updated but may not sync to server'
        });
        throw error;
      }

      return { id, data };
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Task updated',
        message: 'Task has been updated successfully'
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update task',
        message: error.message
      });
    }
  });
};

export const useDeleteTask = () => {
  const deleteTask = useTaskStore(state => state.deleteTask);
  const addNotification = useNotificationStore(state => state.addNotification);

  return useMutation({
    mutationFn: async (taskId: string) => {
      // Update Zustand immediately (optimistic update)
      deleteTask(taskId);

      // Fire and forget API call
      try {
        await taskApi.deleteTask(taskId);
      } catch (error) {
        // If API fails, we keep the optimistic update but show a warning
        addNotification({
          type: 'warning',
          title: 'Task deleted locally',
          message: 'Task was deleted but may not sync to server'
        });
        throw error;
      }

      return taskId;
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Task deleted',
        message: 'Task has been deleted successfully'
      });
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete task',
        message: error.message
      });
    }
  });
};