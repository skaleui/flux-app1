const path = require('path');
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use:[
          {
            loader: "babel-loader",

            options: {
              presets: [ 'es2015' ],
              plugins: [ 'transform-object-rest-spread' ]
            }
          }

        ]

      },
    ]
  },

  entry: {
    cpanel: ["./src/control-panel.js"],
    "message-board": ["./src/message-board"],
    tasks: ["./src/tasks.js"]
  },

  output: {
    path: path.resolve(__dirname, "public"),
      publicPath: "/assets/",
      filename: "[name].bundle.js"
  },
  devServer: { inline: true },
  devtool: 'source-map',
}