import { useState } from 'react';
import { Todo, TodoCategory, Subtask } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Check, X, Calendar, AlertCircle, Clock, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getDueDateStatus, dueDateStatusConfig } from '@/lib/dueDateUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, data: { title: string }) => void;
  onDelete: (id: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

const priorityColors = {
  low: 'bg-info/10 text-info border-info/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

const categoryConfig: Record<TodoCategory, { label: string; icon: string; color: string }> = {
  work: { label: 'Work', icon: '💼', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  personal: { label: 'Personal', icon: '👤', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  study: { label: 'Study', icon: '📚', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  other: { label: 'Others', icon: '📌', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
};

export const TodoItem = ({ todo, onToggle, onUpdate, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const dueDateStatus = getDueDateStatus(todo.dueDate, todo.completed);
  const statusConfig = dueDateStatusConfig[dueDateStatus];

  const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(todo._id, { title: editValue.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(todo._id, newSubtask.trim());
      setNewSubtask('');
      setIsAddingSubtask(false);
    }
  };

  const handleSubtaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSubtask();
    if (e.key === 'Escape') {
      setNewSubtask('');
      setIsAddingSubtask(false);
    }
  };

  return (
    <Collapsible open={isSubtasksOpen} onOpenChange={setIsSubtasksOpen}>
      <div
        className={cn(
          'group rounded-xl bg-card border border-border/50 transition-all duration-200',
          'hover:shadow-md hover:border-border',
          todo.completed && 'opacity-60',
          dueDateStatus === 'overdue' && !todo.completed && 'border-destructive/30 bg-destructive/5',
          dueDateStatus === 'today' && !todo.completed && 'border-warning/30 bg-warning/5'
        )}
      >
        <div className="flex items-center gap-3 p-4">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo._id)}
            className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-gradient-primary data-[state=checked]:border-primary"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                <p
                  className={cn(
                    'font-medium truncate transition-all',
                    todo.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {todo.title}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn('text-xs', priorityColors[todo.priority])}>
                    {todo.priority}
                  </Badge>
                  {todo.category && (
                    <Badge variant="outline" className={cn('text-xs', categoryConfig[todo.category].color)}>
                      <span className="mr-1">{categoryConfig[todo.category].icon}</span>
                      {categoryConfig[todo.category].label}
                    </Badge>
                  )}
                  {todo.dueDate && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs flex items-center gap-1',
                        statusConfig.bgColor,
                        statusConfig.color
                      )}
                    >
                      {dueDateStatus === 'overdue' ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : dueDateStatus === 'today' || dueDateStatus === 'tomorrow' ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <Calendar className="h-3 w-3" />
                      )}
                      {dueDateStatus !== 'none' && statusConfig.label}
                      {dueDateStatus === 'none' && format(new Date(todo.dueDate), 'MMM d')}
                      {dueDateStatus !== 'none' && ` · ${format(new Date(todo.dueDate), 'MMM d')}`}
                    </Badge>
                  )}
                  {totalSubtasks > 0 && (
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      {completedSubtasks}/{totalSubtasks} subtasks
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1">
              {totalSubtasks > 0 && (
                <CollapsibleTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    {isSubtasksOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              )}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsAddingSubtask(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title="Add subtask"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(todo._id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Subtasks section */}
        {(isAddingSubtask || totalSubtasks > 0) && (
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0 ml-8 space-y-2 border-t border-border/30 mt-2 pt-3">
              {todo.subtasks?.map((subtask) => (
                <div key={subtask._id} className="flex items-center gap-2 group/subtask">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => onToggleSubtask(todo._id, subtask._id)}
                    className="h-4 w-4 rounded border-2"
                  />
                  <span className={cn(
                    'flex-1 text-sm',
                    subtask.completed && 'line-through text-muted-foreground'
                  )}>
                    {subtask.title}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteSubtask(todo._id, subtask._id)}
                    className="h-6 w-6 opacity-0 group-hover/subtask:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {isAddingSubtask && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={handleSubtaskKeyDown}
                    placeholder="Add a subtask..."
                    className="h-7 text-sm"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleAddSubtask} className="h-7 w-7">
                    <Check className="h-3 w-3 text-success" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { setNewSubtask(''); setIsAddingSubtask(false); }} className="h-7 w-7">
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};