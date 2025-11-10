/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'peacock-dark': '#0F172A', // A very dark blue, almost black
        'peacock-magenta': '#E02E6E', // Vibrant magenta
        'peacock-sapphire': '#1A52E1', // Deep blue
        'peacock-emerald': '#00A896', // Rich green
        'peacock-marigold': '#FFB700', // Warm yellow/gold
        'peacock-green': '#348e65', // From the logo background
        'peacock-gold-light': '#E6C66E', // From the logo text
      },
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
          serif: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
         'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
}
