interface MicrofrontendConfig {
  name: string;
  route: string;
  component: string;
  description: string;
  version: string;
  dependencies: string[];
}

export class MicrofrontendRegistry {
  private static instance: MicrofrontendRegistry;
  private microfrontends: Map<string, MicrofrontendConfig> = new Map();

  private constructor() {
    this.registerDefaultMicrofrontends();
  }

  public static getInstance(): MicrofrontendRegistry {
    if (!MicrofrontendRegistry.instance) {
      MicrofrontendRegistry.instance = new MicrofrontendRegistry();
    }
    return MicrofrontendRegistry.instance;
  }

  private registerDefaultMicrofrontends() {
    this.register({
      name: 'task-list',
      route: '/',
      component: 'TaskListMicrofrontend',
      description: 'Main dashboard for viewing and managing tasks',
      version: '1.0.0',
      dependencies: ['task-store', 'notification-service']
    });

    this.register({
      name: 'task-create',
      route: '/tasks/create',
      component: 'TaskCreateMicrofrontend',
      description: 'Create new tasks with form validation',
      version: '1.0.0',
      dependencies: ['task-store', 'notification-service']
    });

    this.register({
      name: 'task-detail',
      route: '/tasks/:id',
      component: 'TaskDetailMicrofrontend',
      description: 'View detailed task information and manage status',
      version: '1.0.0',
      dependencies: ['task-store', 'notification-service']
    });

    this.register({
      name: 'task-edit',
      route: '/tasks/:id/edit',
      component: 'TaskEditMicrofrontend',
      description: 'Edit existing task information',
      version: '1.0.0',
      dependencies: ['task-store', 'notification-service']
    });
  }

  public register(config: MicrofrontendConfig): void {
    this.microfrontends.set(config.name, config);
  }

  public get(name: string): MicrofrontendConfig | undefined {
    return this.microfrontends.get(name);
  }

  public getAll(): MicrofrontendConfig[] {
    return Array.from(this.microfrontends.values());
  }

  public getByRoute(route: string): MicrofrontendConfig | undefined {
    return Array.from(this.microfrontends.values()).find(mf => mf.route === route);
  }
}