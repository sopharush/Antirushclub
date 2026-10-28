/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#efe3c8',
        cream2: '#e7d6b4',
        choc: '#3a2318',
        sand: '#d8c29a',
        caramel: '#c0904f',
        sienna: '#a85436',
        espresso: '#281a10',
        cocoa: '#3f2a1a',
        ink: '#2b1d12',
        inksoft: '#6c523a',
        paper: '#f0e5ce',
        paperdim: '#c7b393',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
