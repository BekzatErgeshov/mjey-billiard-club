import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { formatDate, formatPrice, statusLabel } from '@/lib/utils'

const EMPTY = {
  title: '',
  description: '',
  format: 'pool',
  starts_at: '',
  entry_fee: 500,
  prize_pool: 25000,
  max_participants: 16,
}

export default function AdminTournaments() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('tournaments').select('*').order('starts_at', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('tournaments').insert(form)
      if (error) throw error
      toast.success('Турнир создан')
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (t) => {
    if (!confirm(`Удалить «${t.title}»?`)) return
    const { error } = await supabase.from('tournaments').delete().eq('id', t.id)
    if (error) return toast.error(error.message)
    toast.success('Удалён')
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setOpen(true)}>
          <Plus size={16} /> Создать турнир
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((t) => (
          <Card key={t.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-semibold">{t.title}</h4>
                <Badge variant="gold">{statusLabel(t.status)}</Badge>
              </div>
              <p className="text-xs text-muted">
                {formatDate(t.starts_at)} • {t.participants_count}/{t.max_participants} • Призовой {formatPrice(t.prize_pool)}
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={() => remove(t)}>
              <Trash2 size={14} />
            </Button>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новый турнир" size="lg">
        <div className="space-y-4">
          <div>
            <Label>Название</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Описание</Label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light focus:outline-none focus:border-brand-gold/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Формат</Label>
              <select
                value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light focus:outline-none focus:border-brand-gold/60"
              >
                <option value="pool">Pool</option>
                <option value="snooker">Snooker</option>
                <option value="russian">Russian</option>
              </select>
            </div>
            <div>
              <Label>Дата и время</Label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Взнос</Label>
              <Input type="number" value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Призовой фонд</Label>
              <Input type="number" value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Макс. участников</Label>
              <Input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: Number(e.target.value) })} />
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full" loading={saving} onClick={create}>
            Создать
          </Button>
        </div>
      </Modal>
    </div>
  )
}
