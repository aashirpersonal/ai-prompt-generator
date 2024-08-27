module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}