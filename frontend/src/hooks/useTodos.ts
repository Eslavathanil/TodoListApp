import { useState, useEffect, useCallback } from 'react';
import { todoApi, Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (input: CreateTodoInput) => {
    try {
      const newTodo = await todoApi.create(input);
      setTodos((prev) => [newTodo, ...prev]);
      toast({
        title: 'Success',
        description: 'Todo created successfully',
      });
      return newTodo;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create todo';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTodo = async (id: string, input: UpdateTodoInput) => {
    try {
      const updated = await todoApi.update(id, input);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      });
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const updated = await todoApi.toggle(id);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle todo';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCompleted = async () => {
    try {
      await todoApi.deleteCompleted();
      setTodos((prev) => prev.filter((t) => !t.completed));
      toast({
        title: 'Success',
        description: 'Completed todos deleted',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete completed todos';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const reorderTodos = async (orderedIds: string[]) => {
    try {
      const reordered = await todoApi.reorder(orderedIds);
      setTodos(reordered);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reorder todos';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const addSubtask = async (todoId: string, title: string) => {
    try {
      const updated = await todoApi.addSubtask(todoId, title);
      setTodos((prev) => prev.map((t) => (t._id === todoId ? updated : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add subtask';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const toggleSubtask = async (todoId: string, subtaskId: string) => {
    try {
      const updated = await todoApi.toggleSubtask(todoId, subtaskId);
      setTodos((prev) => prev.map((t) => (t._id === todoId ? updated : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle subtask';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteSubtask = async (todoId: string, subtaskId: string) => {
    try {
      const updated = await todoApi.deleteSubtask(todoId, subtaskId);
      setTodos((prev) => prev.map((t) => (t._id === todoId ? updated : t)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete subtask';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    todos,
    setTodos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    reorderTodos,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
};
