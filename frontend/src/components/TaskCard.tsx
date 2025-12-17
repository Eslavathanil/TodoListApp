import { Todo, TodoCategory } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Calendar, Briefcase, User, BookOpen, Tag, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getDueDateStatus, dueDateStatusConfig } from '@/lib/dueDateUtils';

interface TaskCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const categoryConfig: Record<TodoCategory, { label: string; icon: React.ReactNode; borderColor: string; textColor: string }> = {
  work: { 
    label: 'Work', 
    icon: <Briefcase className="w-3 h-3" />, 
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400'
  },
  personal: { 
    label: 'Personal', 
    icon: <User className="w-3 h-3" />, 
    borderColor: 'border-green-500',
    textColor: 'text-green-400'
  },
  study: { 
    label: 'Study', 
    icon: <BookOpen className="w-3 h-3" />, 
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400'
  },
  other: { 
    label: 'Others', 
    icon: <Tag className="w-3 h-3" />, 
    borderColor: 'border-gray-500',
    textColor: 'text-gray-400'
  },
};

export const TaskCard = ({ todo, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const categoryStyle = todo.category ? categoryConfig[todo.category] : null;
  const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  const dueDateStatus = getDueDateStatus(todo.dueDate, todo.completed);
  const dueDateConfig = dueDateStatusConfig[dueDateStatus];

  return (
    <div
      className={cn(
        'group relative bg-card rounded-xl border transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30',
        todo.completed 
          ? 'border-success/30 bg-success/5' 
          : categoryStyle 
            ? categoryStyle.borderColor + '/30' 
            : 'border-border/50'
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header with checkbox and title */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo._id)}
            className={cn(
              'h-5 w-5 mt-0.5 rounded border-2 transition-colors',
              todo.completed 
                ? 'bg-success border-success data-[state=checked]:bg-success' 
                : 'border-muted-foreground/30'
            )}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-semibold text-base leading-tight',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className={cn(
                'text-sm text-muted-foreground mt-1 line-clamp-2',
                todo.completed && 'line-through'
              )}>
                {todo.description}
              </p>
            )}
            {totalSubtasks > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {completedSubtasks}/{totalSubtasks} subtasks completed
              </p>
            )}
          </div>
        </div>

        {/* Category and Due Date */}
        <div className="flex items-center flex-wrap gap-2">
          {categoryStyle && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5',
                categoryStyle.borderColor,
                categoryStyle.textColor
              )}
            >
              {categoryStyle.icon}
              {categoryStyle.label}
            </Badge>
          )}

          {todo.dueDate && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5',
                todo.completed 
                  ? 'text-muted-foreground border-border' 
                  : dueDateConfig.bgColor + ' ' + dueDateConfig.color
              )}
            >
              <Clock className="w-3 h-3" />
              {todo.completed ? (
                format(new Date(todo.dueDate), 'MMM d')
              ) : dueDateStatus !== 'none' ? (
                <span>{dueDateConfig.label}</span>
              ) : (
                format(new Date(todo.dueDate), 'MMM d')
              )}
            </Badge>
          )}
        </div>

        {/* Completion status */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {todo.completed ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Completed {todo.updatedAt ? format(new Date(todo.updatedAt), 'MMM d') : ''}</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {format(new Date(todo.createdAt), 'MMM d')}</span>
            </>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(todo)}
          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(todo._id)}
          className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
