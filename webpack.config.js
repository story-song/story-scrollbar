const path = require('path');
const VueLoaderPlugin = require('vue-loader-plugin')

module.exports = {
  entry: "./index.js",
  mode:'production',
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test:/\.css$/,
        use:[
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          }
        ],
        exclude: /node_modules/
      },
      {
        test:/\.vue$/,
        use:'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    clean: true,
    module: true,
    libraryTarget:"module"
  },
}