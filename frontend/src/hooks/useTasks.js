import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import useDebounce from './useDebounce';

const defaultFilters = {
  search: '',
  priority: '',
  completed: '',
  category: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });
  const debouncedSearch = useDebounce(filters.search, 400);
  const { success, error: showError } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.priority) params.priority = filters.priority;
      if (filters.completed !== '') params.completed = filters.completed;
      if (filters.category) params.category = filters.category;

      const response = await taskService.getTasks(params);
      setTasks(response.tasks);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages,
      });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder, filters.priority, filters.completed, filters.category, debouncedSearch, showError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const createTask = async (data) => {
    try {
      const response = await taskService.createTask(data);
      success('Task created successfully');
      await fetchTasks();
      return response.task;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, data) => {
    try {
      const response = await taskService.updateTask(id, data);
      success('Task updated successfully');
      setTasks((prev) => prev.map((t) => (t._id === id ? response.task : t)));
      return response.task;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      success('Task deleted successfully');
      await fetchTasks();
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await taskService.toggleComplete(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? response.task : t)));
      success(response.message);
      return response.task;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    pagination,
    filters,
    updateFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
};

export default useTasks;
