/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C0392B',
          'red-light': '#E74C3C',
          'red-muted': 'rgba(192,57,43,0.12)',
          dark: '#0D0D12',
          card: '#13131A',
          admin: '#2980B9',
          'admin-light': '#3498DB',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Rajdhani', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(192,57,43,0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(192,57,43,0.4)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        'xl2': '14px',
      },
      boxShadow: {
        'accent': '0 4px 24px rgba(192,57,43,0.25)',
        'admin': '0 4px 24px rgba(41,128,185,0.25)',
        'card': '0 2px 12px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
