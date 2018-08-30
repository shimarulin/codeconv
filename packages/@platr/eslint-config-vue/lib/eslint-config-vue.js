module.exports = {
  extends: [
    require.resolve('@platr/eslint-config-base'),
    require.resolve('plugin:vue/recommended')
  ],
  env: {
    browser: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never'
      }
    ]
  }
}
