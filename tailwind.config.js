/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm neutral palette
        cream: {
          50:  '#FBF9F6',
          100: '#F5F1EA',
          200: '#EBE5DA',
          300: '#D9D0BE',
        },
        ink: {
          50:  '#F7F6F4',
          100: '#EDEAE4',
          200: '#D8D2C6',
          300: '#ADA595',
          400: '#78715F',
          500: '#564E3E',
          600: '#3B3528',
          700: '#2A251B',
          800: '#1C1812',
          900: '#12100B',
        },
        // Accent: warm saffron/terracotta
        saffron: {
          50:  '#FEF4ED',
          100: '#FCE4D1',
          200: '#F9C5A2',
          300: '#F4A06A',
          400: '#EE7C3E',
          500: '#E85D28',   // primary accent
          600: '#CF451A',
          700: '#A83517',
          800: '#822A16',
          900: '#5E2014',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(28,24,18,0.04), 0 4px 12px rgba(28,24,18,0.04)',
        'pop':  '0 1px 3px rgba(28,24,18,0.06), 0 8px 24px rgba(28,24,18,0.08)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      }
    },
  },
  plugins: [],
}
