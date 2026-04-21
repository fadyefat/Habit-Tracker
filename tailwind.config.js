/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(15, 23, 42, 0.4)',
          border: 'rgba(255, 255, 255, 0.3)',
          borderDark: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          primary: '#4f46e5', // Deep indigo
          glow: '#818cf8',
          success: '#10b981',
          warning: '#f59e0b',
        }
      },
      backdropBlur: {
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
}
