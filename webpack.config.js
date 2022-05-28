const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['index1', 'index2', {
          loader: 'index3',
          options: {
            name: 'zzz',
            age: 21,
          }
        }]
      }
    ]
  },
  mode: 'development',
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders')]
  }
}