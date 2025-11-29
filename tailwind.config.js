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
      keyframes: {
        'music-bar': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slideDown': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'music-bar-1': 'music-bar 1s ease-in-out infinite',
        'music-bar-2': 'music-bar 1.2s ease-in-out infinite 0.1s',
        'music-bar-3': 'music-bar 0.8s ease-in-out infinite 0.2s',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideDown': 'slideDown 0.3s ease-out forwards',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
