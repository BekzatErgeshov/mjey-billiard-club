import { motion } from 'framer-motion'

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="relative pt-28 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-60 pointer-events-none" />
      <div className="container-app relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-brand-gold mb-3 font-medium">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg text-muted max-w-2xl">{description}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </div>
  )
}
