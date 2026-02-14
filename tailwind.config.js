/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                heading: ["Oswald", "sans-serif"],
                body: ["Nunito", "sans-serif"],
                bluewater: ["Bluewater Sans", "sans-serif"],
            },
            keyframes: {
                'sparkle-1': {
                    '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                    '50%': { opacity: 1 },
                    '100%': { transform: 'translate(-20px, -20px) scale(1)', opacity: 0 },
                },
                'sparkle-2': {
                    '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                    '50%': { opacity: 1 },
                    '100%': { transform: 'translate(20px, -20px) scale(1)', opacity: 0 },
                },
                'sparkle-3': {
                    '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                    '50%': { opacity: 1 },
                    '100%': { transform: 'translate(-20px, 20px) scale(1)', opacity: 0 },
                },
                'sparkle-4': {
                    '0%': { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                    '50%': { opacity: 1 },
                    '100%': { transform: 'translate(20px, 20px) scale(1)', opacity: 0 },
                },
                'heart-pop': {
                    '0%': { transform: 'scale(1)' },
                    '15%': { transform: 'scale(1.4)' },
                    '30%': { transform: 'scale(0.9)' },
                    '45%': { transform: 'scale(1.15)' },
                    '60%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
                'notification-pulse': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.7)' },
                    '70%': { transform: 'scale(1.1)', boxShadow: '0 0 0 6px rgba(255, 107, 53, 0)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 107, 53, 0)' }
                }
            },
            animation: {
                'sparkle-1': 'sparkle-1 0.6s ease-out forwards',
                'sparkle-2': 'sparkle-2 0.6s ease-out forwards',
                'sparkle-3': 'sparkle-3 0.6s ease-out forwards',
                'sparkle-4': 'sparkle-4 0.6s ease-out forwards',
                'notification-pulse': 'notification-pulse 2s infinite'
            }
        },
    },
    plugins: [],
}
