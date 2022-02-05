module.exports = {
  extends: [
    require.resolve('@codeconv/eslint-config-base'),
    'plugin:vue/vue3-recommended',
  ],
  env: {
    browser: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never',
      },
    ],
  },
}
