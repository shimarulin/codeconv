module.exports = {
  plugins: [
    'markdown',
  ],
  overrides: [
    {
      files: [
        '**/*.md',
      ],
      processor: 'markdown/markdown',
    },
  ],
  extends: [
    'eslint:recommended',
    'standard',
  ],
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
    'arrow-parens': [
      'error',
      'always',
    ],
    // eslint-config-standard override
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: false,
      },
    ],
    // eslint-config-standard override
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
    // eslint-config-standard override
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
    // eslint-config-standard override
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
  },
}
