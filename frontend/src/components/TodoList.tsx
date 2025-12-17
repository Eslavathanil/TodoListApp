import { useTodos } from '@/hooks/useTodos';
import { SortableTodoItem } from './SortableTodoItem';
import { AddTodoForm } from './AddTodoForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, Trash2, Filter, AlertCircle, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Todo, TodoCategory } from '@/lib/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getDueDateStatus } from '@/lib/dueDateUtils';
import { isToday, isTomorrow, startOfDay, isPast } from 'date-fns';

type FilterType = 'all' | 'active' | 'completed';
type CategoryFilter = 'all' | TodoCategory;

const categories: { value: CategoryFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All Categories', icon: '📋' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'study', label: 'Study', icon: '📚' },
  { value: 'other', label: 'Others', icon: '📌' },
];

export const TodoList = () => {
  const { todos, setTodos, isLoading, addTodo, updateTodo, toggleTodo, deleteTodo, deleteCompleted, reorderTodos, addSubtask, toggleSubtask, deleteSubtask } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTodos = useMemo(() => {
    let result = todos;
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }
    
    // Apply status filter
    switch (filter) {
      case 'active':
        return result.filter((t) => !t.completed);
      case 'completed':
        return result.filter((t) => t.completed);
      default:
        return result;
    }
  }, [todos, filter, categoryFilter]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t._id === active.id);
      const newIndex = todos.findIndex((t) => t._id === over.id);
      
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
      
      // Persist the new order
      reorderTodos(newTodos.map((t) => t._id));
    }
  };

  const stats = useMemo(() => {
    const activeTodos = todos.filter((t) => !t.completed);
    const overdue = activeTodos.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return isPast(due) && !isToday(due);
    }).length;
    const dueToday = activeTodos.filter((t) => t.dueDate && isToday(new Date(t.dueDate))).length;
    const dueTomorrow = activeTodos.filter((t) => t.dueDate && isTomorrow(new Date(t.dueDate))).length;
    
    return {
      total: todos.length,
      active: activeTodos.length,
      completed: todos.filter((t) => t.completed).length,
      overdue,
      dueToday,
      dueTomorrow,
    };
  }, [todos]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddTodoForm onAdd={addTodo} />

      {(stats.overdue > 0 || stats.dueToday > 0 || stats.dueTomorrow > 0) && (
        <div className="flex items-center gap-3 flex-wrap">
          {stats.overdue > 0 && (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {stats.overdue} overdue
            </Badge>
          )}
          {stats.dueToday > 0 && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {stats.dueToday} due today
            </Badge>
          )}
          {stats.dueTomorrow > 0 && (
            <Badge variant="outline" className="bg-info/10 text-info border-info/20 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {stats.dueTomorrow} due tomorrow
            </Badge>
          )}
        </div>
      )}

      {todos.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {stats.completed > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={deleteCompleted}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear completed
              </Button>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <SortableTodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onAddSubtask={addSubtask}
                    onToggleSubtask={toggleSubtask}
                    onDeleteSubtask={deleteSubtask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {filteredTodos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No {filter} tasks</p>
            </div>
          )}
        </>
      )}

      {todos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">Add your first task above to get started!</p>
        </div>
      )}
    </div>
  );
};