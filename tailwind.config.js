/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF5',
          100: '#FBF7F0',
          200: '#F5EDE0',
          DEFAULT: '#FBF7F0',
          dark: '#F0E8D8',
        },
        sage: {
          50: '#F0F5F0',
          100: '#DCE8DC',
          200: '#C2D6C2',
          300: '#A8C5A8',
          400: '#8FAF8F',
          500: '#7A9E7A',
          600: '#668C66',
          DEFAULT: '#8FAF8F',
        },
        blush: {
          50: '#FDF5F6',
          100: '#F9E4E6',
          200: '#F3CACF',
          300: '#EDB0B8',
          400: '#E89AA4',
          500: '#D97F8B',
          DEFAULT: '#EDB0B8',
        },
        beige: {
          50: '#FAF5EF',
          100: '#F2E8D8',
          200: '#E5CDB5',
          300: '#D4B896',
          400: '#C4A47E',
          DEFAULT: '#D4B896',
        },
        warm: {
          50: '#F5EDE8',
          100: '#E8D0C5',
          200: '#D4B09E',
          300: '#B8917C',
          400: '#9E7560',
          500: '#8B6F5E',
          DEFAULT: '#8B6F5E',
        },
      },
      fontFamily: {
        sans: ['"Noto Serif TC"', '"Noto Sans TC"', 'serif'],
        display: ['"Noto Serif TC"', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 20px rgba(139, 111, 94, 0.08)',
        'soft-lg': '0 8px 40px rgba(139, 111, 94, 0.12)',
        'soft-xl': '0 16px 60px rgba(139, 111, 94, 0.16)',
        glow: '0 0 30px rgba(143, 175, 143, 0.3)',
        'glow-pink': '0 0 30px rgba(237, 176, 184, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bloom': 'bloom 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'particle': 'particle 2s ease-out forwards',
        'xp-fill': 'xp-fill 1s ease-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        bloom: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        particle: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: 0 },
        },
        'xp-fill': {
          '0%': { width: 'var(--from)' },
          '100%': { width: 'var(--to)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
