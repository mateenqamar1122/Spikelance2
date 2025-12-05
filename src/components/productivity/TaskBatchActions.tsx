import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/services/productivityService";
import { CheckSquare, Trash2, Calendar, Tag, MoveVertical, AlertCircle } from "lucide-react";

interface TaskBatchActionsProps {
  selectedTasks: Task[];
  onBulkStatusChange: (status: "not-started" | "in-progress" | "completed") => void;
  onBulkDelete: () => void;
  onBulkTagAdd: (tag: string) => void;
  onBulkPriorityChange: (priority: "low" | "medium" | "high" | "urgent") => void;
  onBulkDueDateChange: (date: Date) => void;
  onClearSelection: () => void;
}

const TaskBatchActions: React.FC<TaskBatchActionsProps> = ({
  selectedTasks,
  onBulkStatusChange,
  onBulkDelete,
  onBulkTagAdd,
  onBulkPriorityChange,
  onBulkDueDateChange,
  onClearSelection,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  const [isPriorityDialogOpen, setIsPriorityDialogOpen] = React.useState(false);
  const [selectedPriority, setSelectedPriority] = React.useState<"low" | "medium" | "high" | "urgent">("medium");

  const handleBulkDelete = () => {
    onBulkDelete();
    setIsDeleteDialogOpen(false);
  };

  const handleBulkTagAdd = () => {
    if (newTag.trim()) {
      onBulkTagAdd(newTag.trim());
      setNewTag("");
      setIsTagDialogOpen(false);
    }
  };

  const handleBulkPriorityChange = () => {
    onBulkPriorityChange(selectedPriority);
    setIsPriorityDialogOpen(false);
  };

  if (selectedTasks.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-3 flex items-center gap-2">
        <span className="text-sm font-medium">{selectedTasks.length} tasks selected</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CheckSquare className="h-4 w-4 mr-1" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onBulkStatusChange("not-started")}>
              Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkStatusChange("in-progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkStatusChange("completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={() => setIsPriorityDialogOpen(true)}>
          <AlertCircle className="h-4 w-4 mr-1" />
          Priority
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsTagDialogOpen(true)}>
          <Tag className="h-4 w-4 mr-1" />
          Add Tag
        </Button>

        <Button variant="outline" size="sm" className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Cancel
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tasks</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTasks.length} tasks? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag to Tasks</DialogTitle>
            <DialogDescription>
              Add a tag to {selectedTasks.length} selected tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag Name</Label>
              <Input
                id="tag"
                placeholder="Enter tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkTagAdd}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Priority Dialog */}
      <Dialog open={isPriorityDialogOpen} onOpenChange={setIsPriorityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Priority</DialogTitle>
            <DialogDescription>
              Set priority for {selectedTasks.length} selected tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setSelectedPriority(value as "low" | "medium" | "high" | "urgent")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriorityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkPriorityChange}>Update Priority</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskBatchActions;