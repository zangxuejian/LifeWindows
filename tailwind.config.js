/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151714",
        muted: "#6f746e",
        line: "#d9dcd7",
        archive: "#52744f",
        amber: "#c88b28",
        future: "#77879a",
        memorial: "#777b77"
      },
      fontFamily: {
        serif: ["Noto Serif SC", "Songti SC", "STSong", "SimSun", "serif"],
        sans: ["Inter", "PingFang SC", "Microsoft YaHei", "sans-serif"]
      }
    }
  },
  plugins: []
};
