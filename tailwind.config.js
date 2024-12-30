
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        lilac: {
          300: '#D6BAE7',
          400: '#C9A7DD',
          500: '#B793CF',
          600: '#A77FBF',
        },
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};


