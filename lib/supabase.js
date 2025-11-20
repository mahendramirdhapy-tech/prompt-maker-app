// lib/supabase.js - COMPLETE FIX
// Temporary dummy client - No package required
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signInWithOAuth: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve()
  },
  from: () => ({
    insert: () => Promise.resolve({ error: null }),
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null })
    })
  })
};
