module.exports = {
  'presets': [
    'latest-node'
  ],
  'plugins': [
    '@babel/plugin-syntax-json-strings',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        'root': ['./src'],
        'alias': {
          'Utils': './src/common/utils',
          'Config': './src/config',
          'Exceptions': './src/common/exceptions',
          'Db': './src/db',
          'Modules': './src/modules',
          'Helpers': './src/common/helpers'
        }
      }
    ]
  ]
}
