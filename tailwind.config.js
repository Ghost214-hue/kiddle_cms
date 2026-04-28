/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdfaf4',
          100: '#f5f0e8',
          200: '#ede5d8',
          300: '#e0d4c0',
        },
        tan: {
          DEFAULT: '#a0693a',
          light:   '#c48b52',
          dark:    '#7a4e22',
        },
        espresso: {
          DEFAULT: '#3d2f1f',
          light:   '#7a5c3a',
          muted:   '#9a7a5a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '14px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 4px 24px rgba(100, 60, 20, 0.10)',
        'glass-hover': '0 8px 32px rgba(100, 60, 20, 0.18)',
      },
    },
  },
  plugins: [],
}