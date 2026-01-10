import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const { isAuthenticated } = await import("./middleware");
  const { storage } = await import("./storage");
  const { insertTodoSchema, updateTodoSchema } = await import("../shared/schema");
  const { fromZodError } = await import("zod-validation-error");

  // Keep the config route public
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    });
  });

  // Protect all /api/todos routes
  app.use("/api/todos", isAuthenticated);

  // Helper to extract token
  const getToken = (req: any) => req.headers.authorization?.replace("Bearer ", "") || "";

  app.get("/api/todos", async (req, res, next) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const todos = await storage.getTodosByUserId(req.user.id, getToken(req));
      res.json(todos);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/todos", async (req, res, next) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const parseResult = insertTodoSchema.safeParse(req.body);
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }

      const todo = await storage.createTodo(req.user.id, parseResult.data, getToken(req));
      res.status(201).json(todo);
    } catch (err) {
      next(err);
    }
  });

  app.patch("/api/todos/:id", async (req, res, next) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const parseResult = updateTodoSchema.safeParse(req.body);
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ message: validationError.message });
      }

      const todo = await storage.updateTodo(req.params.id, req.user.id, parseResult.data, getToken(req));
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.json(todo);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/todos/:id", async (req, res, next) => {
    try {
      if (!req.user) return res.sendStatus(401);

      const success = await storage.deleteTodo(req.params.id, req.user.id, getToken(req));
      if (!success) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  return httpServer;
}
