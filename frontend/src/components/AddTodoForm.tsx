import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Calendar as CalendarIcon, Loader2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateTodoInput, TodoCategory } from '@/lib/api';

interface AddTodoFormProps {
  onAdd: (todo: CreateTodoInput) => Promise<unknown>;
}

const categories: { value: TodoCategory; label: string; icon: string }[] = [
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'study', label: 'Study', icon: '📚' },
  { value: 'other', label: 'Others', icon: '📌' },
];

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState<TodoCategory | ''>('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onAdd({
        title: title.trim(),
        priority,
        category: category || undefined,
        dueDate: dueDate?.toISOString(),
      });
      setTitle('');
      setDueDate(undefined);
      setPriority('medium');
      setCategory('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 h-12 text-base"
        />
        <Button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={(v) => setCategory(v as TodoCategory)}>
          <SelectTrigger className="w-36">
            <Tag className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select category" />
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-40 justify-start text-left font-normal',
                !dueDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Due date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {dueDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDueDate(undefined)}
            className="text-muted-foreground"
          >
            Clear date
          </Button>
        )}
      </div>
    </form>
  );
};