import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldError } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuthStore()

  const [form, setForm] = useState({ username: '', phone: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }
    setLoading(true)
    try {
      await signUp(form)
      toast.success('Аккаунт создан! Проверьте почту для подтверждения.')
      navigate('/auth/login')
    } catch (err) {
      setError(err.message || 'Не удалось зарегистрироваться')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-soft">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-gradient-gold">Создать аккаунт</h1>
            <p className="mt-2 text-muted">Присоединяйтесь к Mjey Billiard Club</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
                <Input
                  id="username"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="pl-10"
                  placeholder="Ваше имя"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="pl-10"
                  placeholder="+996 700 000 000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/40" size={18} />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10"
                  placeholder="Минимум 6 символов"
                />
              </div>
            </div>

            <FieldError>{error}</FieldError>

            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
              Зарегистрироваться <ChevronRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Уже есть аккаунт?{' '}
            <Link to="/auth/login" className="text-brand-gold hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
