import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

// Hardcoded fallback for production reliability if env vars are missing
// Hardcoded fallback for production reliability if env vars are missing
export const supabaseUrl = process.env.SUPABASE_URL || "https://nmciqbtisianjdzgcczr.supabase.co";
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY2lxYnRpc2lhbmpkemdjY3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzczNzcsImV4cCI6MjA4MzQ1MzM3N30.mR_W8h6B-T-TIZo5LFs5PJO2Wu66Ojt7G5IGgeglhdc";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase configuration");
}

// Create a single supabase client for interaction with auth and data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
