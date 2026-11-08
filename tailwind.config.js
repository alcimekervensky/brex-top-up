/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f9ff',
          500: '#1d4ed8',
          600: '#1e3a8a',
          900: '#020817',
        },
        accent: '#ef4444',
      },
      boxShadow: {
        glow: '0 0 30px rgba(59,130,246,0.35)',
      },
    },
  },
  plugins: [],
};
