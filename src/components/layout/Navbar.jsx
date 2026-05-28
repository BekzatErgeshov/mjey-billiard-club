import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export function Navbar() {
  const navigate = useNavigate()
  const { user, profile, signOut, isAdmin } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        scrolled ? 'backdrop-blur-2xl bg-brand-dark/70 border-b border-white/5 py-3' : 'py-5',
      )}
    >
      <nav className="container-app flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/logo.png"
            alt="Mjey Logo"
            className="w-9 h-9 rounded-xl object-contain bg-brand-dark/50 border border-white/10 group-hover:border-brand-gold/30 transition-colors duration-300 shadow-glow-gold"
          />
          <span className="hidden sm:inline text-lg font-display font-bold text-brand-light tracking-wide">
            Mjey<span className="text-brand-gold">.</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 text-sm rounded-lg transition-all relative',
                    isActive ? 'text-brand-gold' : 'text-brand-light/70 hover:text-brand-light',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl glass hover:bg-white/10 transition text-brand-light/80"
            aria-label="Сменить тему"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full glass hover:bg-white/10 transition"
              >
                <Avatar src={profile?.avatar_url} name={profile?.username || user.email} size="sm" />
                <span className="hidden sm:inline text-sm text-brand-light/90 max-w-[100px] truncate">
                  {profile?.username || 'Профиль'}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-1.5 shadow-soft border border-white/10"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-light/90 hover:bg-white/5 transition"
                    >
                      <UserIcon size={16} /> Мой профиль
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-gold hover:bg-brand-gold/10 transition"
                      >
                        <ShieldCheck size={16} /> Админ-панель
                      </Link>
                    )}
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={16} /> Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="gold" size="sm">Регистрация</Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2.5 rounded-xl glass text-brand-light/80"
            aria-label="Меню"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-sm bg-brand-dark border-l border-white/10 p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-display font-bold text-gradient-gold">Меню</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block px-4 py-3 rounded-xl text-base transition',
                          isActive
                            ? 'bg-brand-gold/10 text-brand-gold'
                            : 'text-brand-light/80 hover:bg-white/5 hover:text-brand-light',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {!user && (
                <div className="mt-8 space-y-2">
                  <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="glass" size="lg" className="w-full">Войти</Button>
                  </Link>
                  <Link to="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="gold" size="lg" className="w-full">Регистрация</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
