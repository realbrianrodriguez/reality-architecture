import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF',
        ink: '#050505',
        'ink-secondary': 'rgba(5, 5, 5, 0.64)',
        'border-hairline': 'rgba(5, 5, 5, 0.10)',
        'glass-fill': 'rgba(255, 255, 255, 0.70)',
        'glass-stroke': 'rgba(255, 255, 255, 0.55)',
        'glass-edge': 'rgba(5, 5, 5, 0.08)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'glass': '28px',
        'glass-sm': '20px',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-lg': '18px',
        'glass-sm': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
