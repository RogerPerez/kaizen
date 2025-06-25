import React, { useState, useEffect } from 'react';
import { Task, CreateTaskData, UpdateTaskData } from '../../types/task';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateTask } from '../../utils/taskUtils';
import { Save, X } from 'lucide-react';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority
      });
    }
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
    };
    
    if (task) {
      onSubmit(submitData as UpdateTaskData);
    } else {
      onSubmit(submitData as CreateTaskData);
    }
  };
  
  const handleChange = (field: keyof CreateTaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder="Enter task title"
        required
      />
      
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Enter task description (optional)"
        rows={4}
      />
      
      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        error={errors.dueDate}
        helperText="Optional - leave blank if no due date"
      />
      
      <Select
        label="Priority"
        value={formData.priority}
        onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
        options={priorityOptions}
      />
      
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          icon={Save}
          loading={loading}
          disabled={loading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          icon={X}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};