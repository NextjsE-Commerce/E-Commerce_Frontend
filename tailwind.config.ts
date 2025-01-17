import { accessedDynamicData } from "next/dist/server/app-render/dynamic-rendering";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container:{
       center: true,
       padding: "15px"
      },

      fontFamily: {
        'monaspace-krypton': ['Monaspace Krypton'],
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "#FF8F9C",
        blackish: "#1b1b1b",
        bluecolor: "#60a5fa"
      },
      
    },
  },
  plugins: [],
} satisfies Config;
