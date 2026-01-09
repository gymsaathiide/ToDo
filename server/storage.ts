import { type Todo, type InsertTodo, type UpdateTodo } from "@shared/schema";
import { supabase } from "./middleware";

export interface IStorage {
  getTodosByUserId(userId: string): Promise<Todo[]>;
  getTodoById(id: string, userId: string): Promise<Todo | undefined>;
  createTodo(userId: string, todo: InsertTodo): Promise<Todo>;
  updateTodo(id: string, userId: string, updates: UpdateTodo): Promise<Todo | undefined>;
  deleteTodo(id: string, userId: string): Promise<boolean>;
}

export class SupabaseStorage implements IStorage {
  async getTodosByUserId(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Map snake_case to camelCase
    return (data || []).map(this.mapTodo);
  }

  async getTodoById(id: string, userId: string): Promise<Todo | undefined> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) return undefined;
    return this.mapTodo(data);
  }

  async createTodo(userId: string, todo: InsertTodo): Promise<Todo> {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        title: todo.title,
        user_id: userId,
        is_completed: false
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapTodo(data);
  }

  async updateTodo(id: string, userId: string, updates: UpdateTodo): Promise<Todo | undefined> {
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;

    const { data, error } = await supabase
      .from("todos")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return undefined;
    return this.mapTodo(data);
  }

  async deleteTodo(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    return !error;
  }

  private mapTodo(item: any): Todo {
    return {
      id: item.id,
      userId: item.user_id,
      title: item.title,
      isCompleted: item.is_completed,
      createdAt: new Date(item.created_at),
    };
  }
}

export const storage = new SupabaseStorage();
