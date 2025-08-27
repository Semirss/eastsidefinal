module.exports = {
  content: ["./index.html"], // Add all HTML files
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#8B6B4F',
        secondary: '#018839',
        accent: '#F0CB93',
        dark: '#1A202C',
      },
    },
  },
  plugins: [],
}