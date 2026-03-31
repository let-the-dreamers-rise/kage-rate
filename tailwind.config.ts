import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111114",
        stone: "#e9e4d8",
        ember: "#e07a3f",
        bronze: "#b8915e",
        steel: "#8894a8"
      },
      boxShadow: {
        panel: "0 30px 90px rgba(9, 10, 16, 0.28)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 20% 20%, rgba(224, 122, 63, 0.18), transparent 32%), radial-gradient(circle at 78% 14%, rgba(184, 145, 94, 0.14), transparent 28%), radial-gradient(circle at 60% 82%, rgba(136, 148, 168, 0.14), transparent 30%)"
      },
      letterSpacing: {
        signal: "0.32em"
      }
    }
  },
  plugins: []
};

export default config;
