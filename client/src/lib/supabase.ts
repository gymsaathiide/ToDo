import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient> | null = null;

async function initSupabase(): Promise<SupabaseClient> {
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
