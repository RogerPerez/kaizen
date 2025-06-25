import React from 'react';
import { useTasks } from '../../hooks/useTasks';

export const TaskInitializer: React.FC = () => {
  useTasks();
  return null;
};