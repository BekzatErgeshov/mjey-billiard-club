import { useEffect, useState } from 'react'
import { Plus, Trash2, AlertOctagon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldError } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { formatDate, formatPrice, statusLabel } from '@/lib/utils'

const PRESETS = [
  { reason: 'Повреждение сукна', amount: 5000 },
  { reason: 'Поломка кия', amount: 3000 },
  { reason: 'Неявка на бронь без отмены', amount: 1000 },
  { reason: 'Курение вне зоны', amount: 500 },
  { reason: 'Грубое поведение', amount: 2000 },
]

export default function AdminFines() {
  const me = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const [fines, setFines] = useState([])
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ user_id: '', reason: '', amount: 500 })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [f, u] = await Promise.all([
      supabase
        .from('fines')
        .select('*, profiles:user_id(username, email)')
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, username, email')
        .order('username')
        .limit(500),
    ])
    if (f.error) console.error('Загрузка штрафов:', f.error)
    if (u.error) console.error('Загрузка юзеров:', u.error)
    setFines(f.data || [])
    setUsers(u.data || [])
  }

  useEffect(() => {
    load()
    const channel = supabase
      .channel('admin-fines')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fines' }, load)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const resetForm = () => {
    setForm({ user_id: '', reason: '', amount: 500 })
    setError('')
  }

  const create = async () => {
    setError('')

    if (profile?.role !== 'admin') {
      setError('У вас нет прав администратора. Проверьте role в таблице profiles.')
      return
    }
    if (!form.user_id) {
      setError('Выберите пользователя')
      return
    }
    if (!form.reason?.trim()) {
      setError('Укажите причину штрафа')
      return
    }
    if (!form.amount || form.amount <= 0) {
      setError('Сумма должна быть больше 0')
      return
    }

    setSaving(true)
    try {
      const payload = {
        user_id: form.user_id,
        reason: form.reason.trim(),
        amount: Number(form.amount),
        status: 'unpaid',
        issued_by: me.id,
      }
      const { data, error } = await supabase
        .from('fines')
        .insert(payload)
        .select()
        .single()

      if (error) {
        console.error('Ошибка вставки штрафа:', error)
        throw error
      }

      toast.success(`Штраф ${formatPrice(payload.amount)} выписан`)
      setOpen(false)
      resetForm()
      load()
    } catch (err) {
      const msg = err.message || 'Не удалось выписать штраф'
      setError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Удалить штраф?')) return
    const { error } = await supabase.from('fines').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Штраф удалён')
    load()
  }

  const applyPreset = (p) => {
    setForm((f) => ({ ...f, reason: p.reason, amount: p.amount }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-display font-semibold">Штрафы</h2>
          <p className="text-xs text-muted mt-1">
            Всего: {fines.length} • Активных: {fines.filter((f) => f.status !== 'paid').length}
          </p>
        </div>
        <Button variant="gold" onClick={() => { setOpen(true); resetForm() }}>
          <Plus size={16} /> Выписать штраф
        </Button>
      </div>

      {fines.length === 0 ? (
        <EmptyState
          icon={AlertOctagon}
          title="Штрафов ещё нет"
          description="Нажмите «Выписать штраф», чтобы создать первый."
        />
      ) : (
        <div className="space-y-3">
          {fines.map((f) => (
            <Card key={f.id} className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-display font-semibold">{f.reason}</h4>
                  <Badge variant={f.status === 'paid' ? 'green' : f.status === 'pending' ? 'amber' : 'red'}>
                    {statusLabel(f.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted">
                  {f.profiles?.username || '—'} ({f.profiles?.email || '—'}) • {formatDate(f.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-brand-gold text-lg">{formatPrice(f.amount)}</span>
                <Button size="sm" variant="danger" onClick={() => remove(f.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Новый штраф" size="md">
        <div className="space-y-4">
          <div>
            <Label>Пользователь</Label>
            <select
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light focus:outline-none focus:border-brand-gold/60"
            >
              <option value="">— Выберите пользователя —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-amber-300 mt-1">
                Нет пользователей. Сначала кто-то должен зарегистрироваться.
              </p>
            )}
          </div>

          <div>
            <Label>Причина</Label>
            <Input
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="За что штраф..."
            />
          </div>

          <div>
            <Label>Сумма ({form.amount > 0 ? formatPrice(form.amount) : '—'})</Label>
            <Input
              type="number"
              min={0}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted mb-2">Быстрые шаблоны</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.reason}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-lg glass text-xs text-brand-light/80 hover:bg-white/10 transition"
                >
                  {p.reason} · {formatPrice(p.amount)}
                </button>
              ))}
            </div>
          </div>

          <FieldError>{error}</FieldError>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="lg" className="flex-1" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button variant="gold" size="lg" className="flex-1" loading={saving} onClick={create}>
              Выписать штраф
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
