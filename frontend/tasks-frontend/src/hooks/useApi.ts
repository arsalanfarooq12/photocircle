import { useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/config.ts";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useAuthApi() {
  const [loading, setLoading] = useState(false);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, login, loading };
}

export function useTasksApi() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTasks(res.data.tasks);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (title: string, description?: string) => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/tasks`, {
          title,
          description,
        });
        setTasks((prev) => [res.data, ...prev]);
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, fetchTasks, createTask, updateTask, deleteTask, loading };
}
