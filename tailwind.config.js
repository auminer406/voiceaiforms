/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './app/**/**/*.{js,ts,jsx,tsx,mdx}', // <--- ADDED: To catch files nested deeper in 'app'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}