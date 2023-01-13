/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'radio-yogurt': {
          'primary': '#FDB813',
          'secondary': '#2F495E',
          'tertiary': '#F8F9FA',
        },
        'radio-yogurt-light': {
          'primary': '#FDB813',
          'secondary': '#2F495E',
          'tertiary': '#F8F9FA',
        },
        'radio-yogurt-dark': {
          'primary': '#FDB813',
          'secondary': '#2F495E',
          'tertiary': '#F8F9FA',
        },
      },
    },
  },
  plugins: [],
}
