import React, { useState, useEffect } from "react";
import { Task } from "@/services/productivityService";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import TaskStats from "./TaskStats";
import TaskDueDateReminder from "./TaskDueDateReminder";
import TaskBatchActions from "./TaskBatchActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskManagerProps {
  tasks: Task[];
  onTaskCreate: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onBulkTaskUpdate: (taskIds: string[], updates: Partial<Task>) => void;
  onBulkTaskDelete: (taskIds: string[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onBulkTaskUpdate,
  onBulkTaskDelete,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    tags: [],
    search: "",
  });

  useEffect(() => {
    // Apply filters whenever tasks or filters change
    const filtered = tasks.filter((task) => {
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || task.priority === filters.priority;
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => task.tags?.includes(tag));
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesTags && matchesSearch;
    });

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleTaskSelect = (task: Task, selected: boolean) => {
    setSelectedTasks((prev) =>
      selected
        ? [...prev, task]
        : prev.filter((t) => t.id !== task.id)
    );
  };

  const handleBulkStatusChange = (status: "not-started" | "in-progress" | "completed") => {
    const taskIds = selectedTasks.map((task) => task.id);
    onBulkTaskUpdate(taskIds, { status });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    const taskIds = selectedTasks.map((task) => task.id);
    onBulkTaskDelete(taskIds);
    setSelectedTasks([]);
  };

  const handleBulkTagAdd = (tag: string) => {
    const taskIds = selectedTasks.map((task) => task.id);
    onBulkTaskUpdate(taskIds, {
      tags: [...new Set([...selectedTasks[0].tags || [], tag])],
    });
    setSelectedTasks([]);
  };

  const handleBulkPriorityChange = (priority: "low" | "medium" | "high" | "urgent") => {
    const taskIds = selectedTasks.map((task) => task.id);
    onBulkTaskUpdate(taskIds, { priority });
    setSelectedTasks([]);
  };

  const handleBulkDueDateChange = (dueDate: Date) => {
    const taskIds = selectedTasks.map((task) => task.id);
    onBulkTaskUpdate(taskIds, { due_date: dueDate.toISOString() });
    setSelectedTasks([]);
  };

  const handleTaskClick = (task: Task) => {
    // Implement task click behavior (e.g., open task details)
    console.log("Task clicked:", task);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <TaskFilter
                filters={filters}
                onFilterChange={setFilters}
                tasks={tasks}
              />
              <div className="mt-4">
                <TaskStats tasks={filteredTasks} />
              </div>
              <div className="mt-6">
                <TaskList
                  tasks={filteredTasks}
                  onTaskUpdate={onTaskUpdate}
                  onTaskDelete={onTaskDelete}
                  onTaskSelect={handleTaskSelect}
                  selectedTasks={selectedTasks}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <TaskDueDateReminder
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>

      {isFormOpen && (
        <TaskForm
          onSubmit={(task) => {
            onTaskCreate(task);
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      <TaskBatchActions
        selectedTasks={selectedTasks}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkDelete={handleBulkDelete}
        onBulkTagAdd={handleBulkTagAdd}
        onBulkPriorityChange={handleBulkPriorityChange}
        onBulkDueDateChange={handleBulkDueDateChange}
        onClearSelection={() => setSelectedTasks([])}
      />
    </div>
  );
};

export default TaskManager;