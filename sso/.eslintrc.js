module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended'
  ],
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'ecmaVersion': 2022,
    'sourceType': 'module',
  },
  'rules': {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'semi': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always',
      'imports': 'always',
      'exports': 'always',
      'functions': 'never',
    } ],
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'indent': ['error', 2, {
      'VariableDeclarator': 'first',
    }],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
    }],

    'spaced-comment': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'wrap-iife': ['error', 'inside'],
    'no-redeclare': 'error',
    'eqeqeq': ['error', 'always'],
    'brace-style': ['error', 'stroustrup', {
      'allowSingleLine': false,
    }],

    'no-return-await': 'error',
    'no-await-in-loop': 'error',

    'block-spacing': 'error',
    'space-in-parens': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'arrow-spacing': ['error', {
      'before': true,
      'after': true,
    }],
    'object-curly-spacing': ['error', 'always', {
      'arraysInObjects': true,
      'objectsInObjects': true,
    }],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true,
    }],
  },
  'overrides': [
    {
      'files': ['tests/**/*'],
      'rules': {
        'no-undef': 'off',
        'no-await-in-loop': 'off',
      },
    }
  ],
}
