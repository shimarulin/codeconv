module.exports = {
  plugins: [
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: [
        '**/*.ts',
        '**/*.tsx',
      ],
      parser: '@typescript-eslint/parser',
    },
  ],
  extends: [
    require.resolve('@codeconv/eslint-config-base'),
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // See https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {},
}
