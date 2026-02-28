/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0f172a',
        'bg-card': '#1e293b',
        'bg-card-hover': '#334155',
        'text-main': '#f8fafc',
        'text-muted': '#94a3b8',
        'border-color': '#334155',
        'risk-green': '#22c55e',
        'risk-yellow': '#eab308',
        'risk-red': '#ef4444',
      },
    },
  },
  plugins: [],
}

