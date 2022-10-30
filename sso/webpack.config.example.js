const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.es6', '.js'],
    alias: {
      'Config': path.resolve(__dirname, './src/config'),
      'Utils': path.resolve(__dirname, './src/common/tools'),
      'Exceptions': path.resolve(__dirname, './src/common/exceptions'),
      'Db': path.resolve(__dirname, './src/db'),
      'Modules': path.resolve(__dirname, './src/modules'),
      'Helpers': path.resolve(__dirname, './src/common/helpers'),
      'SchemaRegistryLib': path.resolve(__dirname, '../schema-registry'),
    },
  },
}

