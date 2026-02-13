/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        'petal': '#F3DCD4',
        'cream': '#FDFBF9',
        'charcoal': '#2D2926',
        'rose-accent': '#C49B8D',
        'accent': {
          30: 'rgba(243, 220, 212, 0.3)',
          50: 'rgba(243, 220, 212, 0.5)',
        }
      }
    }
  },
  plugins: [],
}

