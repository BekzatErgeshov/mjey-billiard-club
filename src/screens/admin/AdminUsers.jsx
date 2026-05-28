'use client'

import { useEffect, useState } from 'react'
import { Trash2, ShieldCheck, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'

export default function AdminUsers() {
  const me = useAuthStore((s) => s.user)
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')

  const load = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = users.filter(
    (u) =>
      !q ||
      u.username?.toLowerCase().includes(q.toLowerCase()) ||
      u.email?.toLowerCase().includes(q.toLowerCase()),
  )

  const toggleRole = async (u) => {
    const next = u.role === 'admin' ? 'user' : 'admin'
    const { error } = await supabase.from('profiles').update({ role: next }).eq('id', u.id)
    if (error) return toast.error(error.message)
    toast.success(`Роль обновлена: ${next}`)
    load()
  }

  const removeUser = async (u) => {
    if (u.id === me.id) return toast.error('Нельзя удалить себя')
    if (!confirm(`Удалить ${u.username}?`)) return
    const { error } = await supabase.from('profiles').delete().eq('id', u.id)
    if (error) return toast.error(error.message)
    toast.success('Пользователь удалён')
    load()
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Поиск по имени или email..." value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="space-y-3">
        {filtered.map((u) => (
          <Card key={u.id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <Avatar src={u.avatar_url} name={u.username} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold">{u.username}</h4>
                  {u.role === 'admin' && <Badge variant="gold">Admin</Badge>}
                </div>
                <p className="text-xs text-muted">{u.email}</p>
                {u.phone && <p className="text-xs text-muted">{u.phone}</p>}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => toggleRole(u)}>
                {u.role === 'admin' ? <Shield size={14} /> : <ShieldCheck size={14} />}
                {u.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
              </Button>
              <Button size="sm" variant="danger" onClick={() => removeUser(u)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}