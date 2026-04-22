/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-primary)",
        card: "var(--color-card)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        destructive: "var(--color-destructive)",
        subscription: "var(--color-subscription)",
        white: "#FFFFFF",
      },
      fontFamily: {
        "sans-light": ["PlusJakartaSans-Light"],
        "sans-regular": ["PlusJakartaSans-Regular"],
        "sans-medium": ["PlusJakartaSans-Medium"],
        "sans-semibold": ["PlusJakartaSans-SemiBold"],
        "sans-bold": ["PlusJakartaSans-Bold"],
        "sans-extrabold": ["PlusJakartaSans-ExtraBold"],
      },
    },
  },
  plugins: [],
};
