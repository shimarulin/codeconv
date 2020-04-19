# `@codeconv/eslint-config-base`

> ESLint config based on [StandardJS](https://standardjs.com/)

## Additional features

- lint code block in markdown files
- lint dot files by default
- ignore compiled code (`dist` directory) by default

## Install

Using npm:

```bash
npm install -D @codeconv/eslint-config-base
```

or using yarn:

```bash
yarn add -D @codeconv/eslint-config-base
```

## Usage

Add this to your .eslintrc file:

```json
{
  "extends": ["@codeconv/base"]
}
```

or `.eslintrc.js`:

```javascript
module.exports = {
  root: true,
  extends: [
    '@codeconv/base',
  ],
}
```

Note: We omitted the eslint-config- prefix since it is automatically assumed by ESLint.

## License

[MIT](LICENSE)
