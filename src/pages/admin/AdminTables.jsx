import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { formatPrice, statusLabel } from '@/lib/utils'

const EMPTY = { name: '', table_type: 'pool', hourly_rate: 200, position_x: 30, position_y: 30 }

export default function AdminTables() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    const { data } = await supabase.from('billiard_tables').select('*').order('name')
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    const { error } = await supabase.from('billiard_tables').insert(form)
    if (error) return toast.error(error.message)
    toast.success('Стол создан')
    setOpen(false)
    setForm(EMPTY)
    load()
  }

  const remove = async (t) => {
    if (!confirm(`Удалить «${t.name}»?`)) return
    await supabase.from('billiard_tables').delete().eq('id', t.id)
    load()
  }

  const setStatus = async (t, status) => {
    await supabase.from('billiard_tables').update({ status }).eq('id', t.id)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setOpen(true)}>
          <Plus size={16} /> Добавить стол
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="font-display font-semibold">{t.name}</h4>
                <p className="text-xs text-muted">{t.table_type} • {formatPrice(t.hourly_rate)}/ч</p>
              </div>
              <Badge variant={t.status === 'available' ? 'green' : t.status === 'live' ? 'amber' : 'red'}>
                {statusLabel(t.status)}
              </Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="ghost" onClick={() => setStatus(t, 'available')}>Свободен</Button>
              <Button size="sm" variant="ghost" onClick={() => setStatus(t, 'maintenance')}>Тех</Button>
              <Button size="sm" variant="danger" onClick={() => remove(t)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Новый стол">
        <div className="space-y-3">
          <div>
            <Label>Название</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Тип</Label>
              <select
                value={form.table_type}
                onChange={(e) => setForm({ ...form, table_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-brand-light"
              >
                <option value="pool">Pool</option>
                <option value="snooker">Snooker</option>
                <option value="russian">Russian</option>
              </select>
            </div>
            <div>
              <Label>Тариф/час</Label>
              <Input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Позиция X (%)</Label>
              <Input type="number" min={0} max={100} value={form.position_x} onChange={(e) => setForm({ ...form, position_x: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Позиция Y (%)</Label>
              <Input type="number" min={0} max={100} value={form.position_y} onChange={(e) => setForm({ ...form, position_y: Number(e.target.value) })} />
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full" onClick={create}>Создать</Button>
        </div>
      </Modal>
    </div>
  )
}
