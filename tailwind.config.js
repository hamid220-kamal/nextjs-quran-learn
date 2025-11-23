/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './public/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      aspectRatio: {
        square: '1 / 1',
        video: '16 / 9',
      },
      // Extended color palette for better SEO color contrast
      colors: {
        primary: '#1a73e8',
        secondary: '#4caf50',
        accent: '#ff9800',
      },
      // Responsive typography
      fontSize: {
        'clamp-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'clamp-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'clamp-lg': 'clamp(1.125rem, 3vw, 1.5rem)',
        'clamp-2xl': 'clamp(1.5rem, 4vw, 2.25rem)',
        'clamp-3xl': 'clamp(2rem, 5vw, 3rem)',
      },
    },
  },
  plugins: [],
};
