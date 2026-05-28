import { cn } from '@/lib/utils'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('text-center py-16 px-6', className)}>
      {Icon && (
        <div className="inline-flex w-16 h-16 rounded-2xl glass items-center justify-center text-brand-gold/70 mb-4">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-brand-light">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
