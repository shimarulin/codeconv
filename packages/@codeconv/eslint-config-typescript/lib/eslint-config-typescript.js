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
      parserOptions: {
        project: [
          '**/tsconfig.json',

          /**
           * Additional ESLint configuration
           * */
          '**/tsconfig.eslint.json',
        ],
        projectFolderIgnoreList: [
          'node_modules',
          'test',
        ],
      },
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        // See https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended-configs
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
  ],
  extends: [
    require.resolve('@codeconv/eslint-config-base'),
  ],
  rules: {},
}
