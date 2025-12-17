import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { TaskSidebar } from '@/components/TaskSidebar';
import { TaskMainPanel } from '@/components/TaskMainPanel';
import { useTodos } from '@/hooks/useTodos';
import { Loader2 } from 'lucide-react';
import { TodoCategory } from '@/lib/api';

type FilterType = 'all' | 'active' | 'completed';
type CategoryFilter = 'all' | TodoCategory;

const Index = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { todos, isLoading: todosLoading, addTodo, updateTodo, toggleTodo, deleteTodo } = useTodos();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <TaskSidebar
        todos={todos}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onAddTaskClick={() => setIsAddDialogOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <TaskMainPanel
        todos={todos}
        isLoading={todosLoading}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onAddTodo={addTodo}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        isDialogOpen={isAddDialogOpen}
        onDialogOpenChange={setIsAddDialogOpen}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
};

export default Index;
