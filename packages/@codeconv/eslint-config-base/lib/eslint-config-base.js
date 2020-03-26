module.exports = {
  plugins: [
    'markdown',
  ],
  overrides: [
    {
      files: [
        '**/*.md',
      ],
      processor: 'markdown/.markdown',
    },
  ],
  extends: [
    'standard',
  ],
  env: {
    node: true,
  },
  rules: {
    'array-element-newline': [
      'error',
      'always',
    ],
    'array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 1,
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          minProperties: 1,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: 'never',
        ExportDeclaration: {
          multiline: true,
          minProperties: 1,
        },
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
  },
}
