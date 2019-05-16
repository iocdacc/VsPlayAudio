const path = require('path');

module.exports = {
  //mode: 'development',
  entry: './src/js/vsPlayAudio.js',
  output: {
    filename: 'vsPlayAudio.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'vsPlayAudio',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};