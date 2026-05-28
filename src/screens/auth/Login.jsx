'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/compat/router'
import { motion } from 'framer-motion'
import { Mail, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldError } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const from = search.get('from') || '/profile'
  const { signIn } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form)
      toast.success('С возвращением!')
      router.replace(from)
    } catch (err) {
      setError(err.message || 'Не удалось войти')
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
            <h1 className="text-3xl font-display font-bold text-gradient-gold">Mjey Billiard</h1>
            <p className="mt-2 text-muted">С возвращением. Войдите в свой аккаунт.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <FieldError>{error}</FieldError>

            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
              Войти <ChevronRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Нет аккаунта?{' '}
            <Link to="/auth/register" className="text-brand-gold hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}