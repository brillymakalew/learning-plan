/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                // Futuristic dark palette
                brand: {
                    50: "#f0f4ff",
                    100: "#dde6ff",
                    200: "#c3d0ff",
                    300: "#9db0ff",
                    400: "#7485ff",
                    500: "#5b63f8",
                    600: "#4a47ed",
                    700: "#3d38d4",
                    800: "#3230ab",
                    900: "#2d2e87",
                    950: "#1c1c52",
                },
                surface: {
                    DEFAULT: "#0f0f1a",
                    card: "#16162a",
                    border: "#2a2a4a",
                    muted: "#1e1e35",
                },
                accent: {
                    cyan: "#22d3ee",
                    purple: "#a78bfa",
                    emerald: "#34d399",
                    amber: "#fbbf24",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-hero":
                    "linear-gradient(135deg, #1c1c52 0%, #0f0f1a 50%, #16162a 100%)",
            },
            backdropBlur: {
                xs: "2px",
            },
            boxShadow: {
                glass: "0 4px 32px 0 rgba(91, 99, 248, 0.08)",
                glow: "0 0 20px rgba(91, 99, 248, 0.3)",
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
                slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};
