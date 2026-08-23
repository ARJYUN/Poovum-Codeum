/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#315C2B',
          dark: '#1F4522',
        },
        accent: {
          gold: '#D99A20',
          marigold: '#E87919',
          vermilion: '#C84630',
          brown: '#4A321F',
        },
        background: {
          cream: '#FFF8E7',
          sand: '#F3E5C8',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'Manrope', 'sans-serif'],
        malayalam: ['"Noto Sans Malayalam"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
