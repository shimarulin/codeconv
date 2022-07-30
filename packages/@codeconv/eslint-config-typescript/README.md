# `@codeconv/eslint-config-typescript`

> @codeconv/eslint-config-typescript package

## Install

Using npm:

```bash
npm install @codeconv/eslint-config-typescript
```

or using yarn:

```bash
yarn add @codeconv/eslint-config-typescript
```

## Usage

Add this to your .eslintrc file:

```json
{
  "extends": ["@codeconv/typescript"]
}
```

Note: We omitted the _eslint-config-_ prefix since it is automatically assumed by ESLint.

### Extend and override `tsconfig.json`

In some cases, you may want to extend or override some of the `tsc` options for ESLint. For example, you want to lint
test files but exclude them from the build. For do this, you can create a new config called `tsconfig.eslint.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["tests", "**/__tests__", "**/*.test.ts", "**/*.spec.ts"],
  "exclude": ["node_modules", "dist"]
}
```

it will only apply for ESLint and will override the `exclude` option in that `tsconfig.json`:

```json
{
  "compilerOptions": {
    "declaration": true,
    "importHelpers": true,
    "module": "ESNext",
    "strict": true,
    "target": "ES2020",
    "esModuleInterop": true,
    "moduleResolution": "Node",
    "baseUrl": "./packages",
    "resolveJsonModule": true,
    "paths": {
      "@codeconv/*": ["@codeconv/*/src"]
    }
  },
  "exclude": ["node_modules", "dist", "tests", "**/__tests__", "**/*.test.ts", "**/*.spec.ts"]
}
```

This preset will apply the `tsconfig.eslint.json` file automatically if it exists, no further action is required. See
also https://typescript-eslint.io/docs/linting/typed-linting/monorepos#one-root-tsconfigjson

## License

[MIT](LICENSE)
