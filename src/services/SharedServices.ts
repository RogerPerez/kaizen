import { useTaskStore } from '../store/taskStore';
import { useNotificationStore } from '../store/notificationStore';
import { taskApi } from '../api/taskApi';

export interface SharedServices {
  taskStore: typeof useTaskStore;
  notificationStore: typeof useNotificationStore;
  taskApi: typeof taskApi;
}

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerDefaultServices();
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  private registerDefaultServices() {
    this.register('taskStore', useTaskStore);
    this.register('notificationStore', useNotificationStore);
    this.register('taskApi', taskApi);
  }

  public register(name: string, service: any): void {
    this.services.set(name, service);
  }

  public get<T>(name: string): T {
    return this.services.get(name);
  }

  public getAll(): Map<string, any> {
    return new Map(this.services);
  }
}

export const useSharedServices = (): SharedServices => {
  const registry = ServiceRegistry.getInstance();
  
  return {
    taskStore: registry.get('taskStore'),
    notificationStore: registry.get('notificationStore'),
    taskApi: registry.get('taskApi')
  };
};