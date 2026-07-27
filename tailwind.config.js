/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          soft: '#eff4ff',
          ring: '#bfdbfe',
        },
        accent: {
          DEFAULT: '#7c3aed',
          soft: '#f3eefe',
        },
        success: {
          DEFAULT: '#15803d',
          soft: '#e8f5ee',
        },
        warning: {
          DEFAULT: '#b45309',
          soft: '#fdf3e7',
        },
        danger: {
          DEFAULT: '#dc2626',
          soft: '#fdecec',
        },
        ink: {
          heading: '#0f172a',
          body: '#334155',
          muted: '#64748b',
        },
        canvas: '#f5f7fb',
        surface: '#ffffff',
        line: '#d7e0ea',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '24px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)',
        card: '0 1px 3px rgba(15,23,42,0.05), 0 8px 24px rgba(15,23,42,0.06)',
        lift: '0 8px 30px rgba(15,23,42,0.12)',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
