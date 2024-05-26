/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        jost: ['Jost', 'sans-serif']
      },
      transitionDuration: {
        2000: '2000ms'
      }
    }
  },
  plugins: []
}
