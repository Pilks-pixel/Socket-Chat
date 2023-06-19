/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Bai Jamjuree"'],
        'body': ['Poppins'],
      },
      fontSize: {
        clamp: "clamp(1rem, 5vw, 3rem)",
      },
      colors: {
        'headings-purple': '#5B60CD',
      },
      width: {
        min_func: "min(100%, 350px)",
      },
    },
  },
  plugins: [],
}

