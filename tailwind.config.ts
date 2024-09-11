import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'brand-deepblue': '#0A78C2',
        'brand-skyblue': '#5AC8FA',
        'brand-purple': '#9256F4',
      },
    },
  },
  plugins: [],
}
export default config
