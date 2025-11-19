/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-green-100',
    'text-green-600',
    'dark:bg-green-900/30',
    'dark:text-green-400',
    'bg-red-100',
    'text-red-600',
    'dark:bg-red-900/30',
    'dark:text-red-400',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}