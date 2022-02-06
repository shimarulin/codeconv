# `@codeconv/eslint-config-vue`

> Vue ESLint config based on [eslint-config-standard](https://github.com/standard/eslint-config-standard) by
> [StandardJS](https://standardjs.com/) and 'plugin:vue/vue3-recommended' from
> [eslint-plugin-vue](https://eslint.vuejs.org/)

## Usage

Add this to your .eslintrc file:

```json
{
  "extends": ["@codeconv/vue"]
}
```

Note: We omitted the eslint-config- prefix since it is automatically assumed by ESLint.

### TypeScript support

If you add `@codeconv/eslint-config-typescript` to devDependencies, the TypeScript support will be enabled
automatically.
