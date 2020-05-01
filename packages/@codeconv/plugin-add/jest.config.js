module.exports = {
  verbose: true,
  testTimeout: 10000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>',
  ],
  moduleNameMapper: {
    '@codeconv/utils': '<rootDir>/../utils/src',
  },
}
