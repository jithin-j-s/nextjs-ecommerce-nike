/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nike: {
          black: '#111111',
          gray: '#757575',
          lightgray: '#F5F5F5',
        }
      },
      fontFamily: {
        'nike': ['Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}