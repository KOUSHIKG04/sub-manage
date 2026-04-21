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
        background: "#FBF6F3",
        foreground: "#010101",
        card: "#FFFFFF",
        muted: "#ffe7da9a",
        "muted-foreground": "#A7A4A2",
        primary: "#010101",
        accent: "#FF5C00",
        border: "#A7A4A2",
        success: "#14761A",
        destructive: "#FF4F41",
        subscription: "#8fd1bd",
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
