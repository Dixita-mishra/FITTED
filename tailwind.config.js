/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fitted: {
          bg: '#FAF6ED',           // Logo warm cream linen
          bgSoft: '#F4EFE4',
          card: '#FFFFFF',
          cardHover: '#FDFBF7',
          border: '#E8E1D3',
          borderDark: '#D8CFBE',
          brown: '#6B4423',        // Rich Warm Cognac Espresso Brown for buttons
          brownLight: '#8C5A32',
          brownDark: '#4A2E1E',
          teal: '#2C524D',         // Logo emblem deep slate teal
          tealLight: '#3D6C66',
          tealDark: '#1B3733',
          rose: '#A3586D',         // Logo emblem mauve rose
          roseLight: '#C0758B',
          sand: '#E0934F',         // Logo emblem needle gold/amber
          sandLight: '#F5B074',
          taupe: '#B8A28E',        // Logo emblem thread tan
          charcoal: '#1E2229',     // High contrast text dark charcoal
          text: '#1E2229',
          muted: '#5C6370',
          darkMuted: '#8C93A0',
          surface: '#FFFFFF',
          surfaceDark: '#181C22',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Playfair Display', 'Clash Display', 'serif'],
      },
      boxShadow: {
        'glow-brown': '0 0 25px rgba(107, 68, 35, 0.25)',
        'glow-teal': '0 0 25px rgba(44, 82, 77, 0.15)',
        'glow-rose': '0 0 25px rgba(163, 88, 109, 0.15)',
        'glow-sand': '0 0 25px rgba(224, 147, 79, 0.2)',
        'cream-card': '0 10px 30px -5px rgba(50, 40, 30, 0.06), 0 0 1px 1px rgba(232, 225, 211, 0.8)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6B4423 0%, #A3586D 50%, #E0934F 100%)',
        'brown-gradient': 'linear-gradient(135deg, #8C5A32 0%, #6B4423 50%, #4A2E1E 100%)',
        'rose-gradient': 'linear-gradient(135deg, #C0758B 0%, #A3586D 100%)',
        'teal-gradient': 'linear-gradient(135deg, #3D6C66 0%, #2C524D 100%)',
        'sand-gradient': 'linear-gradient(135deg, #F5B074 0%, #E0934F 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FAF6ED 0%, #F4EFE4 100%)',
      }
    },
  },
  plugins: [],
}
