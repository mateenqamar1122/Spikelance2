import React from "react";
import { format, isToday, isTomorrow, isPast, differenceInDays } from "date-fns";
import { Bell, Calendar, AlertTriangle } from "lucide-react";
import { Task } from "@/services/productivityService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskDueDateReminderProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskDueDateReminder: React.FC<TaskDueDateReminderProps> = ({ tasks, onTaskClick }) => {
  // Filter tasks with due dates
  const tasksWithDueDates = tasks.filter(task => task.due_date && task.status !== "completed");
  
  // Sort tasks by due date (closest first)
  const sortedTasks = [...tasksWithDueDates].sort((a, b) => {
    const dateA = new Date(a.due_date!);
    const dateB = new Date(b.due_date!);
    return dateA.getTime() - dateB.getTime();
  });

  // Group tasks by urgency
  const overdueTasks = sortedTasks.filter(task => isPast(new Date(task.due_date!)) && !isToday(new Date(task.due_date!)));
  const todayTasks = sortedTasks.filter(task => isToday(new Date(task.due_date!)));
  const tomorrowTasks = sortedTasks.filter(task => isTomorrow(new Date(task.due_date!)));
  const upcomingTasks = sortedTasks.filter(task => {
    const dueDate = new Date(task.due_date!);
    return !isPast(dueDate) && !isToday(dueDate) && !isTomorrow(dueDate);
  });

  // If no tasks with due dates, return null
  if (tasksWithDueDates.length === 0) {
    return null;
  }

  const getDueDateLabel = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      const days = differenceInDays(new Date(), date);
      return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    if (isToday(date)) return "Due today";
    if (isTomorrow(date)) return "Due tomorrow";
    return `Due ${format(date, "MMM d")}`;
  };

  const getDueDateColor = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "text-red-500 dark:text-red-400";
    if (isToday(date)) return "text-orange-500 dark:text-orange-400";
    if (isTomorrow(date)) return "text-yellow-500 dark:text-yellow-400";
    return "text-blue-500 dark:text-blue-400";
  };

  return (
    <Card className="border-brand-blue/10 shadow-md animate-fade-in-up">
      <CardHeader className="pb-2 bg-gradient-to-r from-brand-blue/5 to-brand-cyan/5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-blue" />
          Due Date Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {overdueTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1 text-red-500 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Overdue
              </h4>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className="p-2 border rounded-md hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                    onClick={() => onTaskClick(task)}
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {getDueDateLabel(task.due_date!)}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${task.priority === "urgent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {overdueTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{overdueTasks.length - 3} more overdue tasks
                  </p>
                )}
              </div>
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1 text-orange-500 dark:text-orange-400">
                <Bell className="h-4 w-4" />
                Due Today
              </h4>
              <div className="space-y-2">
                {todayTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className="p-2 border rounded-md hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                    onClick={() => onTaskClick(task)}
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-orange-500 dark:text-orange-400">
                        Due today
                      </p>
                    </div>
                    <Badge variant="outline" className={`${task.priority === "urgent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : ""}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {todayTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{todayTasks.length - 3} more tasks due today
                  </p>
                )}
              </div>
            </div>
          )}

          {tomorrowTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                <Calendar className="h-4 w-4" />
                Due Tomorrow
              </h4>
              <div className="space-y-2">
                {tomorrowTasks.slice(0, 2).map(task => (
                  <div 
                    key={task.id} 
                    className="p-2 border rounded-md hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                    onClick={() => onTaskClick(task)}
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-yellow-500 dark:text-yellow-400">
                        Due tomorrow
                      </p>
                    </div>
                    <Badge variant="outline">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {tomorrowTasks.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{tomorrowTasks.length - 2} more tasks due tomorrow
                  </p>
                )}
              </div>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1 text-blue-500 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
                Upcoming
              </h4>
              <div className="space-y-2">
                {upcomingTasks.slice(0, 2).map(task => (
                  <div 
                    key={task.id} 
                    className="p-2 border rounded-md hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                    onClick={() => onTaskClick(task)}
                  >
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-blue-500 dark:text-blue-400">
                        {format(new Date(task.due_date!), "MMM d")}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {upcomingTasks.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{upcomingTasks.length - 2} more upcoming tasks
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDueDateReminder;