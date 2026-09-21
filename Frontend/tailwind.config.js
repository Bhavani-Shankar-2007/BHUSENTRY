/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkGreen: '#14532D', // Primary Dark Green (Authority/Nature)
          green: '#16A34A',     // Active Green
          blue: '#0284C7',      // GIS/Tech Sky Blue
          navy: '#0F172A',      // Dark Navy (Sidebar & High Contrast)
          bg: '#F8FAFC',        // Light Background
          white: '#FFFFFF'
        },
        risk: {
          low: '#16A34A',       // LOW -> Green
          moderate: '#EAB308',  // MODERATE -> Yellow/Amber
          high: '#F97316',      // HIGH -> Orange
          veryHigh: '#DC2626'   // VERY HIGH -> Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
};
