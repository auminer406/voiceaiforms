// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- CHANGED FROM 'tailwindcss'
    'autoprefixer': {},
  },
};