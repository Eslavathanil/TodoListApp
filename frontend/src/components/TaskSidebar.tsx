import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  LogOut, 
  ListTodo, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  User, 
  BookOpen, 
  Tag,
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo, TodoCategory } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';

type FilterType = 'all' | 'active' | 'completed';
type CategoryFilter = 'all' | TodoCategory;

interface TaskSidebarProps {
  todos: Todo[];
  statusFilter: FilterType;
  categoryFilter: CategoryFilter;
  onStatusFilterChange: (filter: FilterType) => void;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
  onAddTaskClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const categoryConfig: Record<TodoCategory | 'all', { label: string; icon: React.ReactNode; colorDot: string }> = {
  all: { label: 'All Categories', icon: <ListTodo className="w-4 h-4" />, colorDot: 'bg-primary' },
  work: { label: 'Work', icon: <Briefcase className="w-4 h-4" />, colorDot: 'bg-blue-500' },
  personal: { label: 'Personal', icon: <User className="w-4 h-4" />, colorDot: 'bg-green-500' },
  study: { label: 'Study', icon: <BookOpen className="w-4 h-4" />, colorDot: 'bg-purple-500' },
  other: { label: 'Others', icon: <Tag className="w-4 h-4" />, colorDot: 'bg-gray-500' },
};

export const TaskSidebar = ({
  todos,
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  onAddTaskClick,
  isOpen,
  onClose,
}: TaskSidebarProps) => {
  const { user, logout } = useAuth();

  const stats = {
    total: todos.length,
    pending: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const categoryCounts = {
    all: todos.length,
    work: todos.filter((t) => t.category === 'work').length,
    personal: todos.filter((t) => t.category === 'personal').length,
    study: todos.filter((t) => t.category === 'study').length,
    other: todos.filter((t) => t.category === 'other' || !t.category).length,
  };

  const handleFilterClick = (callback: () => void) => {
    callback();
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Profile Section */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-3 pr-8 lg:pr-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary font-medium">Welcome back,</p>
              <p className="text-primary font-semibold truncate text-sm">{user?.email}</p>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            ✌️ {stats.total} total tasks
          </p>
          <Button
            onClick={() => {
              onAddTaskClick();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            <Sparkles className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Status Filters */}
        <div className="p-5 border-b border-sidebar-border">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-primary/30 rounded" />
            Status
          </p>
          <div className="space-y-1">
            <SidebarFilterItem
              active={statusFilter === 'all'}
              onClick={() => handleFilterClick(() => onStatusFilterChange('all'))}
              icon={<ListTodo className="w-4 h-4" />}
              label="All Tasks"
              emoji="📋"
              count={stats.total}
            />
            <SidebarFilterItem
              active={statusFilter === 'active'}
              onClick={() => handleFilterClick(() => onStatusFilterChange('active'))}
              icon={<Clock className="w-4 h-4" />}
              label="Pending"
              emoji="💼"
              count={stats.pending}
            />
            <SidebarFilterItem
              active={statusFilter === 'completed'}
              onClick={() => handleFilterClick(() => onStatusFilterChange('completed'))}
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Completed"
              emoji="✅"
              count={stats.completed}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-5 flex-1 overflow-y-auto">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-accent/30 rounded-full" />
            Categories
          </p>
          <div className="space-y-1">
            {(Object.keys(categoryConfig) as (TodoCategory | 'all')[]).map((cat) => (
              <SidebarCategoryItem
                key={cat}
                active={categoryFilter === cat}
                onClick={() => handleFilterClick(() => onCategoryFilterChange(cat))}
                icon={categoryConfig[cat].icon}
                label={categoryConfig[cat].label}
                colorDot={categoryConfig[cat].colorDot}
                count={categoryCounts[cat]}
              />
            ))}
          </div>
        </div>

        {/* Mobile Footer Actions */}
        <div className="lg:hidden p-5 border-t border-sidebar-border flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};

interface SidebarFilterItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  emoji: string;
  count: number;
}

const SidebarFilterItem = ({ active, onClick, icon, label, emoji, count }: SidebarFilterItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent'
    )}
  >
    <span className="flex items-center gap-2">
      {icon}
      {label}
      <span>{emoji}</span>
    </span>
    <Badge
      variant="secondary"
      className={cn(
        'min-w-[24px] h-6 flex items-center justify-center',
        active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted'
      )}
    >
      {count}
    </Badge>
  </button>
);

interface SidebarCategoryItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  colorDot: string;
  count: number;
}

const SidebarCategoryItem = ({ active, onClick, icon, label, colorDot, count }: SidebarCategoryItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all',
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent'
    )}
  >
    <span className="flex items-center gap-2">
      <span className={cn('w-2 h-2 rounded-full', colorDot)} />
      {icon}
      {label}
    </span>
    <Badge
      variant="secondary"
      className={cn(
        'min-w-[24px] h-6 flex items-center justify-center',
        active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted'
      )}
    >
      {count}
    </Badge>
  </button>
);
