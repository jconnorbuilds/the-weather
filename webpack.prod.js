const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/assets/index.html',
      minify: { removeRedundantAttributes: false },
    }),

    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
});
