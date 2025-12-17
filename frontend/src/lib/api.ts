// API configuration for connecting to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authApi = {
  register: (name: string, email: string, password: string) =>
    fetchApi<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    fetchApi<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => fetchApi<{ user: User }>('/auth/me'),

  forgotPassword: (email: string) =>
    fetchApi<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchApi<{ message: string }>(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// Todo API
export const todoApi = {
  getAll: () => fetchApi<Todo[]>('/todos'),

  getById: (id: string) => fetchApi<Todo>(`/todos/${id}`),

  create: (todo: CreateTodoInput) =>
    fetchApi<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    }),

  update: (id: string, todo: UpdateTodoInput) =>
    fetchApi<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    }),

  toggle: (id: string) =>
    fetchApi<Todo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    }),

  deleteCompleted: () =>
    fetchApi<{ message: string }>('/todos', {
      method: 'DELETE',
    }),

  reorder: (orderedIds: string[]) =>
    fetchApi<Todo[]>('/todos/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderedIds }),
    }),

  addSubtask: (todoId: string, title: string) =>
    fetchApi<Todo>(`/todos/${todoId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  toggleSubtask: (todoId: string, subtaskId: string) =>
    fetchApi<Todo>(`/todos/${todoId}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH',
    }),

  deleteSubtask: (todoId: string, subtaskId: string) =>
    fetchApi<Todo>(`/todos/${todoId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    }),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export type TodoCategory = 'work' | 'personal' | 'study' | 'other';

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: TodoCategory;
  dueDate?: string;
  order: number;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: TodoCategory;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: TodoCategory;
  dueDate?: string;
}
