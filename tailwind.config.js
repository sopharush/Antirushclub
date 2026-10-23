/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#faf7f2',
        paper2: '#f2ebe0',
        choc: '#3a2318',
        choc2: '#5c3d29',
        ink: '#241a12',
        inksoft: '#6a5544',
        cream: '#f3ecdf',
        creamdim: '#cbb9a1',
        black2: '#15110e',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
