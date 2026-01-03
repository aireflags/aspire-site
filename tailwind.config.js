/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        background: {
          light: '#ffffff',
          dark: '#101622'
        },
        'background-light': '#ffffff',
        'background-dark': '#101622',
        'surface-dark': '#1c2533',
        'border-dark': '#324467',
        card: {
          light: '#ffffff',
          dark: '#1c2127'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

