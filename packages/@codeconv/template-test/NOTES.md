# Add test tools

## Common

### Root

For single package:

```bash
yarn add -D jest eslint-plugin-jest
```

For Monorepo:

```bash
yarn add -D -W jest eslint-plugin-jest
```

Patch `.eslintrc.json`

```js
const eslintrc = require('./eslintrc.json')
if (!eslintrc.extends.some((item) => item === 'plugin:jest/recommended')) {
  eslintrc.extends.push('plugin:jest/recommended')
}

if (!eslintrc.extends.some((item) => item === 'plugin:jest/style')) {
  eslintrc.extends.push('plugin:jest/style')
}
```

## Package or child package

For TypeScript

```bash
yarn add -D ts-jest @types/jest
```

Add `jest.config.js`

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```
