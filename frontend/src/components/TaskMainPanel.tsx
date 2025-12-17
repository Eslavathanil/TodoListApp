import { useState, useMemo } from 'react';
import { Todo, CreateTodoInput, TodoCategory } from '@/lib/api';
import { TaskCard } from './TaskCard';
import { AddTaskDialog } from './AddTaskDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Sparkles, CheckCircle2, Loader2, AlertCircle, Clock, Menu, ArrowUpDown, RotateCcw } from 'lucide-react';
import { isPast, isToday, isTomorrow } from 'date-fns';

type FilterType = 'all' | 'active' | 'completed';
type CategoryFilter = 'all' | TodoCategory;
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
type SortOption = 'created' | 'dueDate' | 'priority';

interface TaskMainPanelProps {
  todos: Todo[];
  isLoading: boolean;
  statusFilter: FilterType;
  categoryFilter: CategoryFilter;
  onAddTodo: (input: CreateTodoInput) => Promise<unknown>;
  onToggle: (id: string) => void;
  onUpdate: (id: string, data: CreateTodoInput) => void;
  onDelete: (id: string) => void;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onMenuClick?: () => void;
}

export const TaskMainPanel = ({
  todos,
  isLoading,
  statusFilter,
  categoryFilter,
  onAddTodo,
  onToggle,
  onUpdate,
  onDelete,
  isDialogOpen,
  onDialogOpenChange,
  onMenuClick,
}: TaskMainPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const filteredTodos = useMemo(() => {
    let result = todos;

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    // Apply status filter
    switch (statusFilter) {
      case 'active':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [todos, statusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  const dueDateStats = useMemo(() => {
    const activeTodos = todos.filter((t) => !t.completed);
    return {
      overdue: activeTodos.filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return isPast(due) && !isToday(due);
      }).length,
      dueToday: activeTodos.filter((t) => t.dueDate && isToday(new Date(t.dueDate))).length,
      dueTomorrow: activeTodos.filter((t) => t.dueDate && isTomorrow(new Date(t.dueDate))).length,
    };
  }, [todos]);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
              <span className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg md:text-xl">
                📋
              </span>
              Tasks
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              {filteredTodos.length} of {todos.length} tasks shown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48 md:w-64 bg-muted/50 border-muted-foreground/20"
            />
          </div>
          <Button
            onClick={() => onDialogOpenChange(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow shrink-0"
          >
            <Plus className="w-4 h-4 sm:mr-2" />
            <Sparkles className="w-4 h-4 mr-1 sm:mr-2 hidden sm:inline" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Priority Filter & Sort Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Priority Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Priority:</span>
          <div className="flex items-center gap-1.5">
            {(['all', 'high', 'medium', 'low'] as PriorityFilter[]).map((p) => (
              <Button
                key={p}
                variant={priorityFilter === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter(p)}
                className={priorityFilter === p 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 hover:bg-muted'
                }
              >
                {p === 'all' ? '🔘 All' : p === 'high' ? '🔴 High' : p === 'medium' ? '🟡 Medium' : '🟢 Low'}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px] bg-muted/50 border-muted-foreground/20">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg">
              <SelectItem value="created">📅 Created</SelectItem>
              <SelectItem value="dueDate">⏰ Due Date</SelectItem>
              <SelectItem value="priority">🎯 Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(priorityFilter !== 'all' || sortBy !== 'created') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPriorityFilter('all');
              setSortBy('created');
            }}
            className="text-muted-foreground hover:text-foreground ml-auto"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Due Date Alerts - scrollable on mobile */}
      {(dueDateStats.overdue > 0 || dueDateStats.dueToday > 0 || dueDateStats.dueTomorrow > 0) && (
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 mb-4 md:mb-6 scrollbar-hide">
          {dueDateStats.overdue > 0 && (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {dueDateStats.overdue} overdue
            </Badge>
          )}
          {dueDateStats.dueToday > 0 && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {dueDateStats.dueToday} due today
            </Badge>
          )}
          {dueDateStats.dueTomorrow > 0 && (
            <Badge variant="outline" className="bg-info/10 text-info border-info/20 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {dueDateStats.dueTomorrow} due tomorrow
            </Badge>
          )}
        </div>
      )}

      {/* Task Grid - Responsive */}
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
          {filteredTodos.map((todo) => (
            <TaskCard
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No matching tasks' : 'No tasks yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Click "Add Task" to create your first task!'}
          </p>
        </div>
      )}

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={isDialogOpen || !!editingTodo}
        onOpenChange={(open) => {
          onDialogOpenChange(open);
          if (!open) setEditingTodo(null);
        }}
        onSubmit={async (input) => {
          if (editingTodo) {
            onUpdate(editingTodo._id, {
              title: input.title,
              description: input.description,
              priority: input.priority,
              category: input.category,
              dueDate: input.dueDate,
            });
          } else {
            await onAddTodo(input);
          }
        }}
        editingTodo={editingTodo}
      />
    </div>
  );
};
