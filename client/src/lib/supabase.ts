import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient> | null = null;

async function initSupabase(): Promise<SupabaseClient> {
  // Use environment variables if available, otherwise check hardcoded fallback (for APK reliability)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nmciqbtisianjdzgcczr.supabase.co";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY2lxYnRpc2lhbmpkemdjY3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzczNzcsImV4cCI6MjA4MzQ1MzM3N30.mR_W8h6B-T-TIZo5LFs5PJO2Wu66Ojt7G5IGgeglhdc";

  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  const response = await fetch('/api/config');
  const config = await response.json();

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error('Supabase configuration not available');
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

export function getSupabase(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return Promise.resolve(supabaseInstance);
  }

  if (!initPromise) {
    initPromise = initSupabase().then((client) => {
      supabaseInstance = client;
      return client;
    });
  }

  return initPromise;
}

export { supabaseInstance as supabase };
