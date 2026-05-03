/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a"
        },
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af"
        },
        mint: {
          50: "#ecfdf5",
          500: "#10b981",
          700: "#047857"
        },
        amber: {
          50: "#fffbeb",
          500: "#f59e0b",
          700: "#b45309"
        }
      },
      boxShadow: {
        soft: "0 16px 45px rgba(15, 23, 42, 0.08)",
        card: "0 8px 28px rgba(15, 23, 42, 0.06)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
