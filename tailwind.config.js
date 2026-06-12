/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif KR"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        wedding: {
          primary: '#5D5D5D',
          secondary: '#8E8E8E',
          accent: '#B08E8E',
          bg: '#F9F9F9',
        }
      }
    },
  },
  plugins: [],
}
