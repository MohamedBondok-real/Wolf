/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050208',
          900: '#0a0512',
          800: '#120a1f',
        },
        wine: {
          400: '#8e2a4d',
          500: '#6e1f3c',
          600: '#521630',
        },
        lilac: {
          300: '#d8c7f5',
          400: '#b79ae8',
          500: '#9a76d6',
        },
        night: {
          400: '#2b3a67',
          500: '#1d2a4d',
          600: '#141d38',
        },
        blush: '#f3c6d3',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(154, 118, 214, 0.35)',
        'glow-pink': '0 0 40px rgba(243, 198, 211, 0.25)',
        'glow-wine': '0 0 50px rgba(142, 42, 77, 0.45)',
        glass: '0 8px 40px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at 30% 20%, rgba(110, 31, 60, 0.35), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(29, 42, 77, 0.5), transparent 55%)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [],
};
