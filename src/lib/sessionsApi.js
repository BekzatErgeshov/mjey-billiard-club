import { supabase } from './supabaseClient'

export async function startLiveSession({ tableId, hourlyRate, userId, startedBy }) {
  const { data: session, error } = await supabase
    .from('live_sessions')
    .insert({
      table_id: tableId,
      hourly_rate: hourlyRate,
      user_id: userId || null,
      started_by: startedBy,
      status: 'active',
    })
    .select()
    .single()
  if (error) throw error

  await supabase.from('billiard_tables').update({ status: 'live' }).eq('id', tableId)
  return session
}

export async function stopLiveSession(session) {
  const endedAt = new Date()
  const startMs = new Date(session.started_at).getTime()
  const playedMinutes = Math.max(1, Math.floor((endedAt.getTime() - startMs) / 60000))
  const finalPrice = Math.round((playedMinutes / 60) * session.hourly_rate)

  const { error } = await supabase
    .from('live_sessions')
    .update({
      ended_at: endedAt.toISOString(),
      played_minutes: playedMinutes,
      final_price: finalPrice,
      status: 'ended',
    })
    .eq('id', session.id)
  if (error) throw error

  await supabase
    .from('billiard_tables')
    .update({ status: 'available' })
    .eq('id', session.table_id)

  return { playedMinutes, finalPrice }
}
