const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, './src/assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/assets/index.html',
    }),
    new StylelintPlugin({ exclude: ['**/weather-icons**'] }),
  ],
});
