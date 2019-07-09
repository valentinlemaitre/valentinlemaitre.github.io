const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let config = {
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  entry: [
    './src/js/index.js',
  ],
  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: './bundle.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.resolve(__dirname, './public/dist'),
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7'],
                  },
                  useBuiltIns: 'usage',
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
    ]
  },
  optimization: {
    runtimeChunk: false,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            comments: /^!/,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true
  },
  devtool: 'eval-source-map'
}

module.exports = config;