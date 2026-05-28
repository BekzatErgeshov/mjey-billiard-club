import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Phone, CreditCard, QrCode, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toast'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { PAYMENT_INFO, STORAGE_BUCKETS } from '@/lib/constants'
import { formatPrice, formatDateTime } from '@/lib/utils'

// type: 'booking' | 'tournament' | 'fine'
export default function PaymentPage() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [entity, setEntity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      let res
      if (type === 'booking') {
        res = await supabase
          .from('bookings')
          .select('*, billiard_tables(name)')
          .eq('id', id)
          .single()
      } else if (type === 'tournament') {
        res = await supabase
          .from('tournament_registrations')
          .select('*, tournaments(*)')
          .eq('id', id)
          .single()
      } else if (type === 'fine') {
        res = await supabase.from('fines').select('*').eq('id', id).single()
      }
      setEntity(res?.data || null)
      setLoading(false)
    })()
  }, [type, id, user])

  const amount =
    type === 'booking'
      ? entity?.total_price
      : type === 'tournament'
      ? entity?.tournaments?.entry_fee
      : entity?.amount

  const title =
    type === 'booking'
      ? `Бронь стола ${entity?.billiard_tables?.name || ''}`
      : type === 'tournament'
      ? entity?.tournaments?.title
      : entity?.reason

  const handleUpload = async () => {
    if (!file) {
      toast.error('Загрузите фото чека')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKETS.RECEIPTS)
        .upload(path, file)
      if (upErr) throw upErr
      const { data: pub } = supabase.storage.from(STORAGE_BUCKETS.RECEIPTS).getPublicUrl(path)

      const { error: payErr } = await supabase.from('payments').insert({
        user_id: user.id,
        payment_type: type,
        reference_id: id,
        amount,
        receipt_url: pub.publicUrl,
        status: 'pending',
      })
      if (payErr) throw payErr

      // обновим статус оплаты у самой сущности
      if (type === 'booking') {
        await supabase.from('bookings').update({ payment_status: 'pending' }).eq('id', id)
      } else if (type === 'tournament') {
        await supabase.from('tournament_registrations').update({ payment_status: 'pending' }).eq('id', id)
      } else if (type === 'fine') {
        await supabase.from('fines').update({ status: 'pending' }).eq('id', id)
      }

      setDone(true)
      toast.success('Чек загружен. Ожидайте подтверждения админом.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="pt-32 text-center text-muted">Загрузка...</div>
  if (!entity) return <div className="pt-32 text-center text-muted">Запись не найдена</div>

  return (
    <>
      <PageHeader eyebrow="Оплата" title="Завершение оплаты" />

      <section className="container-app py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-xl font-semibold mb-4">К оплате</h3>
            <div className="space-y-3 text-sm">
              <Row label="Назначение" value={title} />
              {type === 'booking' && entity.start_time && (
                <Row label="Время" value={formatDateTime(entity.start_time)} />
              )}
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-muted">К оплате</span>
                <span className="text-3xl font-display font-bold text-brand-gold">
                  {formatPrice(amount)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-xl font-semibold mb-4">Реквизиты</h3>
            <div className="space-y-3">
              <Detail icon={Phone} label="Номер телефона" value={PAYMENT_INFO.phone} />
              <Detail icon={CreditCard} label="Карта" value={PAYMENT_INFO.card} />
              <div className="flex items-start gap-3 pt-2">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                  <QrCode size={22} />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">QR-код</div>
                  <div className="aspect-square w-40 glass rounded-xl flex items-center justify-center text-muted text-xs">
                    QR placeholder
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="text-brand-gold" size={20} /> Загрузите чек
            </h3>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle2 className="mx-auto text-status-available mb-4" size={64} />
                <h4 className="text-xl font-display font-semibold mb-2">Чек отправлен</h4>
                <p className="text-muted text-sm">
                  Админ проверит оплату в ближайшее время. Статус обновится в вашем профиле.
                </p>
                <Button variant="gold" size="lg" className="mt-6" onClick={() => navigate('/profile')}>
                  В профиль
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center hover:border-brand-gold/40 transition cursor-pointer">
                  <label htmlFor="receipt" className="cursor-pointer block">
                    <Upload size={36} className="mx-auto text-brand-gold/60 mb-3" />
                    {file ? (
                      <div>
                        <p className="text-brand-light">{file.name}</p>
                        <p className="text-xs text-muted mt-1">
                          {(file.size / 1024).toFixed(1)} КБ
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-brand-light/80">Нажмите чтобы загрузить</p>
                        <p className="text-xs text-muted mt-1">PNG, JPG до 10 МБ</p>
                      </>
                    )}
                    <input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full mt-5"
                  loading={uploading}
                  disabled={!file}
                  onClick={handleUpload}
                >
                  Отправить на проверку
                </Button>

                <p className="text-xs text-muted mt-3 text-center">
                  После отправки админ проверит чек. Статус — в вашем профиле.
                </p>
              </>
            )}
          </Card>
        </div>
      </section>
    </>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
        <div className="text-brand-light font-medium">{value}</div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="text-brand-light text-right">{value}</span>
    </div>
  )
}
