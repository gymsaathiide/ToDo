import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@/lib/supabase';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    getSupabase().then((client) => {
      setSupabase(client);
      
      client.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          if (event === 'SIGNED_OUT') {
            queryClient.clear();
          }
        }
      );

      unsubscribe = () => subscription.unsubscribe();
    }).catch((error) => {
      console.error('Failed to initialize Supabase:', error);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not initialized') };
    }
    const { error } = await supabase.auth.signOut();
    if (!error) {
      queryClient.clear();
    }
    return { error };
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
  };
}
