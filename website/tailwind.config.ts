import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "button-primary": "linear-gradient(180deg, #FF8E4D 0%, #FF6C15 100%)",
        "button-primary-disabled":
          "linear-gradient(180deg, #FF8E4D 0%, #FF6C15 100%)",
        "button-primary-hovered":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #FF8E4D 0%, #FF6C15 100%)",
      },
      boxShadow: {
        "button-primary":
          "0 1px 3px 0 rgba(10, 10, 10, 0.15), 0 7px 11px -5px rgba(10, 10, 10, 0.11), 0 2px 1px 0 rgba(255, 255, 255, 0.14) inset",
        "button-primary-disabled":
          "0 1px 3px 0 rgba(10,10,10,0.15), 0 7px 11px -5px rgba(10,10,10,0.11), inset 0 2px 1px 0 rgba(255,255,255,0.14)",
        "button-primary-focused":
          "0 0 0 1px #FFF, 0 0 0 4px #FFEBD4, 0 1px 3px 0 rgba(10, 10, 10, 0.15), 0 7px 11px -5px rgba(10, 10, 10, 0.11), inset 0 2px 1px 0 rgba(255, 255, 255, 0.14)",
      },
      colors: {
        button: {
          "primary-custom": "#DB6825",
        },
        orange: {
          50: "#FFF6ED",
          100: "#FFEBD4",
          200: "#FFD4A8",
          300: "#FFB570",
          400: "#FF8937",
          500: "#FF6C15",
          600: "#F04D06",
          700: "#C73807",
          800: "#9e2d0E",
          900: "#7F280F",
          950: "#451105",
          hemi: "#FF5F00",
        },
        points: {
          bsquared: "#FFB852",
          eigenpie: "#131247",
          "pump-btc": "#69DFFA",
          solv: "#EDE5FB",
          unirouter: "#9600FF",
        },
        sky: {
          450: "#009CF5",
          550: "#0EA5E9",
          850: "#004E7B",
          950: "#738ABC",
        },
        "token-selector-hover": {
          eth: "rgba(98, 126, 234, 0.08)",
          usdc: "rgba(39, 117, 202, 0.08)",
          usdt: "rgba(39, 161, 124, 0.08)",
        },
      },
      fontSize: {
        // Prefer ordering by font size instead of keys
        /* eslint-disable sort-keys */
        xxs: [
          "0.688rem", // 11px,
          {
            letterSpacing: "0.2px",
            lineHeight: "16px",
          },
        ],
        xs: [
          "0.75rem", // 12px,
          {
            letterSpacing: "0.1px",
            lineHeight: "17px",
          },
        ],
        sm: [
          "0.8125rem", // 13px
          {
            letterSpacing: "0",
            lineHeight: "18px",
          },
        ],
        smd: [
          "0.875rem", // 14px
          {
            letterSpacing: "-0.06px",
            lineHeight: "20px",
          },
        ],
        mid: [
          "0.938rem", // 15px
          {
            letterSpacing: "-0.12px",
            lineHeight: "22px",
          },
        ],
        base: [
          "1rem", // 16px
          {
            letterSpacing: "-0.2px",
            lineHeight: "24px",
          },
        ],
        lg: [
          "1.125rem", // 18px
          {
            letterSpacing: "-0.36px",
            lineHeight: "24px",
          },
        ],
        xl: [
          "1.25rem", // 20px
          {
            letterSpacing: "-0.4px",
            lineHeight: "26px",
          },
        ],
        "2xl": [
          "1.5rem", // 24px
          {
            letterSpacing: "-0.48px",
            lineHeight: "32px",
          },
        ],
        "2.33xl": [
          "1.75rem", // 28px
          {
            letterSpacing: "-0.28px",
            lineHeight: "32px",
          },
        ],
        "3xl": [
          "1.875rem", // 30px
          {
            letterSpacing: "-0.6px",
            lineHeight: "40px",
          },
        ],
        "3.25xl": [
          "2rem", // 32px
          {
            letterSpacing: "-0.64px",
            lineHeight: "40px",
          },
        ],
        "4xl": [
          "2.25rem", // 36px
          {
            letterSpacing: "-0.72px",
            lineHeight: "40px",
          },
        ],
        "5xl": [
          "3rem", // 48px
          {
            letterSpacing: "-0.96px",
            lineHeight: "56px",
          },
        ],
        "6xl": [
          "3.75rem", // 60px
          {
            letterSpacing: "-1.2px",
            lineHeight: "60px",
          },
        ],
        "7xl": [
          "4.5rem", // 72px
          {
            letterSpacing: "-1.44px",
            lineHeight: "72px",
          },
        ],
        "8xl": [
          "6rem", // 96px
          {
            letterSpacing: "-1.92px",
            lineHeight: "96px",
          },
        ],
        "9xl": [
          "8rem", // 128px
          {
            letterSpacing: "-2.56px",
            lineHeight: "128px",
          },
        ],
        /* eslint-enable sort-keys */
      },
    },
  },
};

export default config;
