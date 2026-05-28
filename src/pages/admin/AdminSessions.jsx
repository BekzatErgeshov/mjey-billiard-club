import { useEffect, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Label } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { LiveSessionCard } from '@/components/booking/LiveSessionCard'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { startLiveSession, stopLiveSession } from '@/lib/sessionsApi'

export default function AdminSessions() {
  const me = useAuthStore((s) => s.user)
  const [sessions, setSessions] = useState([])
  const [tables, setTables] = useState([])
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [pickTable, setPickTable] = useState('')
  const [pickUser, setPickUser] = useState('')

  const load = async () => {
    const [s, t, u] = await Promise.all([
      supabase
        .from('live_sessions')
        .select('*, billiard_tables(name), profiles:user_id(username)')
        .eq('status', 'active')
        .order('started_at'),
      supabase.from('billiard_tables').select('*').eq('status', 'available').eq('is_active', true),
      supabase.from('profiles').select('id, username').order('username').limit(200),
    ])
    setSessions(s.data || [])
    setTables(t.data || [])
    setUsers(u.data || [])
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('admin-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'billiard_tables' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const start = async () => {
    if (!pickTable) return toast.error('Выберите стол')
    try {
      const table = tables.find((t) => t.id === pickTable)
      await startLiveSession({
        tableId: pickTable,
        hourlyRate: table.hourly_rate,
        userId: pickUser || null,
        startedBy: me.id,
      })
      toast.success('Live-сессия запущена')
      setOpen(false)
      setPickTable('')
      setPickUser('')
    } catch (err) { toast.error(err.message) }
  }

  const stop = async (session) => {
    try {
      const { finalPrice, playedMinutes } = await stopLiveSession(session)
      toast.success(`Сессия завершена. ${playedMinutes} мин = ${finalPrice} сом`)
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setOpen(true)}>
          <Play size={16} /> Старт сессии
        </Button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState icon={Play} title="Нет активных сессий" description="Запустите первую сессию." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <LiveSessionCard
              key={s.id}
              session={s}
              tableName={`${s.billiard_tables?.name} • ${s.profiles?.username || 'Гость'}`}
              canStop
              onStop={stop}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Запустить live-сессию">
        <div className="space-y-3">
          <div>
            <Label>Стол (только свободные)</Label>
            <select
              value={pickTable}
              onChange={(e) => setPickTable(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light"
            >
              <option value="">— Выберите стол —</option>
              {tables.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.hourly_rate} сом/ч)</option>)}
            </select>
          </div>
          <div>
            <Label>Игрок (необязательно)</Label>
            <select
              value={pickUser}
              onChange={(e) => setPickUser(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light"
            >
              <option value="">— Гость —</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <Button variant="gold" size="lg" className="w-full" onClick={start}>
            <Play size={16} /> Старт
          </Button>
        </div>
      </Modal>
    </div>
  )
}
