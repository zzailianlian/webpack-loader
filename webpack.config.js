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
        use: [
          // 'index1', 'index2', {
          //   loader: 'index3',
          //   options: {
          //     name: 'zzz',
          //     age: 21,
          //   }
          // },
          // {
          //   loader: 'removeLog-reg-loader',
          //   options: {
          //     log: true,
          //     warnning: true,
          //     error: true,
          //   }
          // }
          {
            loader: 'console-ast-loader',
            options: {
              needRemovedConsoleArray: ['log', 'warn'],
              consolePrefix: {
                error: '我是error前缀：',
                info: {
                  filename: true,
                  location: true
                },
                count:'我是count前缀：'
              }
            }
          }
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: ['css-loader']
      //   // use: ['self-css-loader']
      // }
    ]
  },
  mode: 'development',
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders')]
  }
}