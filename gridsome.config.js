// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "WheelsRentals",
  plugins: [],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },
};
