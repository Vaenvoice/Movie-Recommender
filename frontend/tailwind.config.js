/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        appleGray: '#1c1c1e',
        appleSilver: '#f5f5f7',
        appleBlue: '#0071e3',
        glass: 'rgba(255, 255, 255, 0.1)',
        glassDark: 'rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '20px',
      },
      backdropBlur: {
        'apple': '20px',
      },
      backgroundImage: {
        'gradient-to-t': 'linear-gradient(to top, rgba(0,0,0,0.8) 0, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
