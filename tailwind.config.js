/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        auricyan: '#00E5FF',
        auriviolet: '#8E2DE2'
      },
      fontFamily: {
        sans: ['"Inter"', '"Poppins"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 10px 40px rgba(0, 229, 255, 0.25)',
        glass: '0 20px 45px rgba(0, 0, 0, 0.35)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadein: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        fadein: 'fadein 1s ease forwards'
      }
    }
  },
  plugins: [forms]
};
