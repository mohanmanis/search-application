var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: "ts-loader"
        },
      ],
      include: path.join(__dirname, 'src')
    },{
      test: /\.css?$/,
      use: [
        "style-loader",
        "css-loader"
      ],
      include: path.join(__dirname, 'src')
    }]
  },
  devServer: {
    port: 3020,
    hot: true,
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  performance: { hints: false }
};
