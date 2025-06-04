// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// postcss.config.ts
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};