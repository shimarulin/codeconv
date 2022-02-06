const hasEslintConfigTypescript = require('./has-eslint-config-typescript')

const jsConfig = [
  require.resolve('@codeconv/eslint-config-base'),
  'plugin:vue/vue3-recommended',
]

const tsConfig = [
  require.resolve('@codeconv/eslint-config-base'),
  require.resolve('@codeconv/eslint-config-typescript'),
  'plugin:vue/vue3-recommended',
]

module.exports = {
  extends: hasEslintConfigTypescript ? tsConfig : jsConfig,
  parserOptions: {
    parser: hasEslintConfigTypescript ? '@typescript-eslint/parser' : '@babel/eslint-parser',
  },
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
