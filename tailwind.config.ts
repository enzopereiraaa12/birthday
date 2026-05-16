import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bubblegum: "#ff69b4",
        blush: "#ffc0cb",
        chrome: "#e9edf6",
        night: "#130813",
        plasma: "#ff2ca8"
      },
      boxShadow: {
        glossy: "0 18px 60px rgba(255, 105, 180, 0.28)",
        chrome: "inset 0 1px 0 rgba(255,255,255,0.9), 0 14px 40px rgba(255,105,180,0.22)"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"]
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-130%) skewX(-18deg)" },
          "100%": { transform: "translateX(150%) skewX(-18deg)" }
        },
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.82) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.18) rotate(18deg)" }
        },
        floaty: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(-3deg)" },
          "50%": { transform: "translate3d(0,-18px,0) rotate(5deg)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        }
      },
      animation: {
        shimmer: "shimmer 2.6s ease-in-out infinite",
        twinkle: "twinkle 2.2s ease-in-out infinite",
        floaty: "floaty 5.5s ease-in-out infinite",
        scan: "scan 4.8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
