/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                rajdhani: ['Rajdhani', 'sans-serif'],
            },
            colors: {
                f1: {
                    red: '#E8002D',
                    orange: '#FF8000',
                    bg: '#050505',
                    card: '#0F0F0F',
                    border: '#1A1A1A',
                    muted: '#2A2A2A',
                },
                team: {
                    mclaren: '#FF8000',
                    ferrari: '#E8002D',
                    redbull: '#3671C6',
                    mercedes: '#27F4D2',
                    astonmartin: '#358C75',
                    cadillac: '#FFF500',
                    williams: '#64C4FF',
                    audi: '#C0C0C0',
                    alpine: '#FF87BC',
                    haas: '#B6BABD',
                    racingbulls: '#6692FF',
                },
            },
            animation: {
                'fill-bar': 'fillBar 1s ease-out forwards',
                'pulse-subtle': 'pulseSubtle 2s infinite',
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'blink': 'blink 1s step-start infinite',
            },
            keyframes: {
                fillBar: {
                    '0%': { width: '0%' },
                    '100%': { width: 'var(--bar-width)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(16px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                blink: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
            },
        },
    },
    plugins: [],
}
