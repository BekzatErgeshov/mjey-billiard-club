import { motion } from 'framer-motion'

const IMAGES = [
  'https://images.unsplash.com/photo-1615722440048-da4fd9202894?q=80&w=1200',
  'https://images.unsplash.com/photo-1606206522398-de44a6cb6a83?q=80&w=1200',
  'https://images.unsplash.com/photo-1574629173326-7b54ad48cb89?q=80&w=1200',
  'https://images.unsplash.com/photo-1551406483-3731d1997540?q=80&w=1200',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=1200',
  'https://images.unsplash.com/photo-1583852041434-7b46f00cb4dc?q=80&w=1200',
]

export function GalleryPreview() {
  return (
    <section className="container-app py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold">Атмосфера</span>
        <h2 className="mt-3 text-4xl sm:text-5xl font-display font-bold">
          Загляните <span className="text-gradient-gold">внутрь</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {IMAGES.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
              i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
