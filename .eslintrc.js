module.exports = {
  root: true,
  extends: [
    '@codeconv/typescript',
  ],
  ignorePatterns: [
    // # Dependency directories
    'node_modules/',
    // # Compiled code
    '**/dist',
    // # Configuration files
    '!.*rc.js',
  ],
}
