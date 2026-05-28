/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B3D2E',
          dark: '#071E16',
          card: '#102820',
          hover: '#145A43',
          gold: '#C8A96B',
          light: '#F5F5F5',
        },
        status: {
          available: '#22c55e',
          booked: '#ef4444',
          selected: '#C8A96B',
          live: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(200, 169, 107, 0.25)',
        'glow-green': '0 0 30px rgba(20, 90, 67, 0.4)',
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(200,169,107,0.15), transparent 60%)',
        'radial-green': 'radial-gradient(circle at 50% 100%, rgba(11,61,46,0.6), transparent 70%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
