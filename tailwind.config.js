import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#4a4a4a',
      white: '#ffffff',
    },
    fontFamily: {
      sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'shrink-me': {
          primary: '#48bfcd',
          secondary: '#034e56'
        }
      },
      gridTemplateColumns: {
        '12': 'repeat(12, 1fr)',
      }
    },
  },
  plugins: [],
}
