'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Trophy, AlertOctagon, Upload, Save } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabaseClient'
import { STORAGE_BUCKETS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { MyBookings } from '@/components/profile/MyBookings'
import { MyTournaments } from '@/components/profile/MyTournaments'
import { MyFines } from '@/components/profile/MyFines'

const TABS = [
  { key: 'bookings', label: 'Брони', icon: Calendar },
  { key: 'tournaments', label: 'Турниры', icon: Trophy },
  { key: 'fines', label: 'Штрафы', icon: AlertOctagon },
]

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthStore()
  const [tab, setTab] = useState('bookings')
  const [username, setUsername] = useState(profile?.username || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Профиль обновлён')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: pub } = supabase.storage.from(STORAGE_BUCKETS.AVATARS).getPublicUrl(path)
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: pub.publicUrl })
        .eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Аватар обновлён')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Аккаунт" title="Мой профиль" />

      <section className="container-app py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center">
            <div className="relative inline-block group">
              <Avatar src={profile?.avatar_url} name={profile?.username || user?.email} size="xl" />
              <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                <Upload className="text-white" size={20} />
                <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
              </label>
            </div>
            {uploading && <p className="text-xs text-muted mt-2">Загрузка...</p>}

            <h3 className="mt-4 text-xl font-display font-semibold">{profile?.username}</h3>
            <p className="text-sm text-muted">{user?.email}</p>
            {profile?.role === 'admin' && (
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                Администратор
              </span>
            )}

            <div className="mt-6 space-y-3 text-left">
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <Button variant="gold" size="md" loading={saving} onClick={onSave} className="w-full">
                <Save size={16} /> Сохранить
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="flex gap-2 mb-6 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition',
                  tab === t.key
                    ? 'bg-brand-gold text-brand-dark shadow-glow-gold'
                    : 'glass text-brand-light/70 hover:bg-white/10',
                )}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'bookings' && <MyBookings userId={user?.id} />}
          {tab === 'tournaments' && <MyTournaments userId={user?.id} />}
          {tab === 'fines' && <MyFines userId={user?.id} />}
        </motion.div>
      </section>
    </>
  )
}