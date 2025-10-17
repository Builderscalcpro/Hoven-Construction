import { useMemo } from 'react';
import { Card } from '@/components/ui/card';

interface Task {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
}

interface GanttChartProps {
  tasks: Task[];
}

export function GanttChart({ tasks }: GanttChartProps) {
  const { minDate, maxDate, dateRange } = useMemo(() => {
    if (tasks.length === 0) return { minDate: new Date(), maxDate: new Date(), dateRange: [] };
    
    const dates = tasks.flatMap(t => [new Date(t.start_date), new Date(t.end_date)]);
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const range = [];
    const current = new Date(min);
    while (current <= max) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
    
    return { minDate: min, maxDate: max, dateRange: range };
  }, [tasks]);

  const getTaskPosition = (task: Task) => {
    const start = new Date(task.start_date);
    const end = new Date(task.end_date);
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (tasks.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">No tasks to display</Card>;
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b pb-2 mb-4">
            <div className="w-48 font-semibold">Task</div>
            <div className="flex-1 flex">
              {dateRange.map((date, i) => (
                <div key={i} className="flex-1 text-xs text-center text-muted-foreground">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center">
                <div className="w-48 text-sm truncate pr-4">{task.name}</div>
                <div className="flex-1 relative h-8">
                  <div className="absolute inset-0 border-l border-r border-dashed border-gray-200" />
                  <div
                    className={`absolute h-6 top-1 rounded ${getStatusColor(task.status)} opacity-80 flex items-center justify-center text-xs text-white font-medium`}
                    style={getTaskPosition(task)}
                  >
                    {task.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
