import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                aflewo: {
                    gold: "hsl(45 100% 50%)",
                    brown: "hsl(20 30% 18%)",
                    emerald: "hsl(160 84% 39%)",
                    "gold-light": "hsl(45 100% 60%)",
                    "emerald-dark": "hsl(160 84% 30%)",
                },
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                breathe: "breathe 4s ease-in-out infinite",
                "reveal-up": "reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                breathe: {
                    "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
                    "50%": { transform: "scale(1.05)", opacity: "1" },
                },
                "reveal-up": {
                    "0%": { opacity: "0", transform: "translateY(40px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
