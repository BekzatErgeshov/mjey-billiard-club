import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || 'сом'

export function formatPrice(amount) {
  const value = Number(amount || 0)
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ${CURRENCY}`
}

export function formatDate(date, opts = {}) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  })
}

export function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(date) {
  if (!date) return ''
  return `${formatDate(date)} • ${formatTime(date)}`
}

export function formatDuration(minutes) {
  const m = Math.floor(Number(minutes) || 0)
  const h = Math.floor(m / 60)
  const mm = m % 60
  if (h === 0) return `${mm} мин`
  if (mm === 0) return `${h} ч`
  return `${h} ч ${mm} мин`
}

export function hoursBetween(start, end) {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  return Math.max(0, (b - a) / (1000 * 60 * 60))
}

export function minutesBetween(start, end) {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  return Math.max(0, Math.floor((b - a) / (1000 * 60)))
}

export function calculatePrice(hours, hourlyRate) {
  return Math.round(Number(hours) * Number(hourlyRate))
}

export function statusLabel(status) {
  const map = {
    available: 'Свободен',
    booked: 'Забронирован',
    live: 'Идёт игра',
    selected: 'Выбран',
    maintenance: 'Тех. обслуживание',
    pending: 'Ожидает',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    completed: 'Завершено',
    paid: 'Оплачено',
    unpaid: 'Не оплачено',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    refunded: 'Возврат',
    active: 'Активно',
    ended: 'Завершено',
    upcoming: 'Скоро',
    finished: 'Завершён',
  }
  return map[status] || status
}

export function statusColor(status) {
  const map = {
    available: 'text-status-available',
    booked: 'text-status-booked',
    live: 'text-status-live',
    selected: 'text-status-selected',
    paid: 'text-status-available',
    approved: 'text-status-available',
    confirmed: 'text-status-available',
    unpaid: 'text-status-booked',
    rejected: 'text-status-booked',
    cancelled: 'text-status-booked',
    pending: 'text-status-live',
  }
  return map[status] || 'text-brand-light/70'
}

export const HOURLY_RATE_DEFAULT = Number(process.env.NEXT_PUBLIC_HOURLY_RATE) || 200
