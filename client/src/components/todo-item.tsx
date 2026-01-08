import { useState } from "react";
import { Check, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, isCompleted: boolean) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== todo.title) {
      onUpdate(todo.id, trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const isDisabled = isUpdating || isDeleting;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all",
        todo.isCompleted && "opacity-60",
        !isDisabled && "hover:shadow-sm"
      )}
      data-testid={`todo-item-${todo.id}`}
    >
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
        disabled={isDisabled}
        className="h-5 w-5"
        data-testid={`checkbox-todo-${todo.id}`}
      />

      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
            data-testid={`input-edit-todo-${todo.id}`}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={!editTitle.trim()}
            data-testid={`button-save-todo-${todo.id}`}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            data-testid={`button-cancel-edit-${todo.id}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex-1 text-base font-medium transition-all",
              todo.isCompleted && "line-through text-muted-foreground"
            )}
            data-testid={`text-todo-title-${todo.id}`}
          >
            {todo.title}
          </span>

          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
               style={{ visibility: isDisabled ? "hidden" : "visible" }}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={isDisabled}
                  data-testid={`button-edit-todo-${todo.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(todo.id)}
                  disabled={isDisabled}
                  className="text-destructive hover:text-destructive"
                  data-testid={`button-delete-todo-${todo.id}`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
