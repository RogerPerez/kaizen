import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { useTaskStore } from "../store/taskStore";
import { useNotificationStore } from "../store/notificationStore";
import { useEffect } from "react";

export const useTasks = () => {
  const { isInitialized, setTasks, getSortedTasks } = useTaskStore();
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const query = useQuery({
    queryKey: ["initial-tasks"],
    queryFn: taskApi.getTasks,
    staleTime: Infinity, // Never refetch after initial load
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 3,
    enabled: !isInitialized, // Only fetch if not already initialized
  });

  // Update Zustand store when data is loaded for the first time
  useEffect(() => {
    if (query.data && !isInitialized) {
      setTasks(query.data);
    }
  }, [query.data, isInitialized, setTasks]);

  // Handle errors
  useEffect(() => {
    if (query.error) {
      addNotification({
        type: "error",
        title: "Failed to load tasks",
        message: query.error.message,
      });
    }
  }, [query.error, addNotification]);

  return {
    tasks: getSortedTasks("smart"), // Use smart sort by default
    isLoading: query.isLoading && !isInitialized,
    error: query.error,
    isInitialized,
  };
};
