'use client'

import NextLink from 'next/link'
import { useRouter, usePathname, useParams as useNextParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Shim для react-router-dom API под Next.js App Router.
 * Позволяет не переписывать каждый компонент.
 */

export function Link({ to, href, children, replace, state, ...rest }) {
  const target = to ?? href ?? '#'
  return (
    <NextLink href={target} replace={replace} {...rest}>
      {children}
    </NextLink>
  )
}

export function NavLink({ to, href, end = false, className, children, ...rest }) {
  const pathname = usePathname() || '/'
  const target = to ?? href ?? '#'
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(target + '/')

  const computedClass = typeof className === 'function' ? className({ isActive }) : className
  return (
    <NextLink href={target} className={computedClass} {...rest}>
      {children}
    </NextLink>
  )
}

export function useNavigate() {
  const router = useRouter()
  return (path, opts) => {
    if (typeof path === 'number') return router.back()
    if (opts?.replace) return router.replace(path)
    return router.push(path)
  }
}

export function useLocation() {
  const pathname = usePathname() || '/'
  return { pathname, state: null, search: '', hash: '' }
}

export function useParams() {
  return useNextParams() || {}
}

export function Navigate({ to, replace }) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

// заглушка
export function Outlet() {
  return null
}
