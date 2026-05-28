'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('billiard_tables')
      .select('*')
      .eq('is_active', true)
      .order('name')
    setTables(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('tables-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'billiard_tables' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return { tables, loading, reload: load }
}