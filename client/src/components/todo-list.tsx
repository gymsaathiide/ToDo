import { CheckCircle2, Circle, ClipboardList } from "lucide-react";
import { TodoItem } from "@/components/todo-item";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Todo {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: string, isCompleted: boolean) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  updatingIds: Set<string>;
  deletingIds: Set<string>;
}

export function TodoList({
  todos,
  isLoading,
  onToggle,
  onUpdate,
  onDelete,
  updatingIds,
  deletingIds,
}: TodoListProps) {
  const [showCompleted, setShowCompleted] = useState(true);

  const activeTodos = todos.filter((todo) => !todo.isCompleted);
  const completedTodos = todos.filter((todo) => todo.isCompleted);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border bg-card p-4"
          >
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold" data-testid="text-empty-state-title">
          No tasks yet
        </h3>
        <p className="text-sm text-muted-foreground" data-testid="text-empty-state-description">
          Add your first task above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTodos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Active Tasks
            </h2>
            <Badge variant="secondary" className="ml-auto" data-testid="badge-active-count">
              {activeTodos.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isUpdating={updatingIds.has(todo.id)}
                isDeleting={deletingIds.has(todo.id)}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-2 px-0 hover:bg-transparent"
              data-testid="button-toggle-completed"
            >
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Completed
              </span>
              <Badge variant="secondary" data-testid="badge-completed-count">
                {completedTodos.length}
              </Badge>
              <ChevronDown
                className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
                  showCompleted ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isUpdating={updatingIds.has(todo.id)}
                isDeleting={deletingIds.has(todo.id)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
