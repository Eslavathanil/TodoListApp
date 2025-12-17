import { isToday, isTomorrow, isPast, differenceInDays, startOfDay } from 'date-fns';

export type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none';

export const getDueDateStatus = (dueDate: string | undefined, completed: boolean): DueDateStatus => {
  if (!dueDate || completed) return 'none';
  
  const due = new Date(dueDate);
  const today = startOfDay(new Date());
  
  if (isPast(due) && !isToday(due)) return 'overdue';
  if (isToday(due)) return 'today';
  if (isTomorrow(due)) return 'tomorrow';
  
  const daysUntil = differenceInDays(due, today);
  if (daysUntil <= 7) return 'upcoming';
  
  return 'none';
};

export const dueDateStatusConfig: Record<DueDateStatus, { label: string; color: string; bgColor: string }> = {
  overdue: { 
    label: 'Overdue', 
    color: 'text-destructive', 
    bgColor: 'bg-destructive/10 border-destructive/20' 
  },
  today: { 
    label: 'Due Today', 
    color: 'text-warning', 
    bgColor: 'bg-warning/10 border-warning/20' 
  },
  tomorrow: { 
    label: 'Due Tomorrow', 
    color: 'text-info', 
    bgColor: 'bg-info/10 border-info/20' 
  },
  upcoming: { 
    label: 'Upcoming', 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted/50 border-border' 
  },
  none: { 
    label: '', 
    color: 'text-muted-foreground', 
    bgColor: '' 
  },
};
