'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  init: async () => {
    set({ loading: true })
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await get().setUser(session.user)
    } else {
      set({ user: null, profile: null })
    }
    set({ loading: false, initialized: true })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await get().setUser(session.user)
      } else {
        set({ user: null, profile: null })
      }
    })
  },

  setUser: async (user) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    set({ user, profile })
  },

  refreshProfile: async () => {
    const user = get().user
    if (!user) return
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    set({ profile })
  },

  signUp: async ({ email, password, username, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, phone } },
    })
    if (error) throw error
    return data
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/profile` },
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  isAdmin: () => get().profile?.role === 'admin',
}))