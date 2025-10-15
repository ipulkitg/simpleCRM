/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        background: '#F9FAFB',
        stage: {
          new: '#9CA3AF',
          qualified: '#3B82F6',
          proposal: '#FACC15',
          negotiation: '#F97316',
          won: '#10B981',
          lost: '#EF4444',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
