# `@codeconv/eslint-config-base`

> ESLint config based on ['eslint:recommended'](https://github.com/eslint/eslint/blob/main/conf/eslint-recommended.js)
> and [StandardJS](https://standardjs.com/)

## Install

```shell
npm install --dev eslint @codeconv/eslint-config-base
```

or

```shell
yarn add -D eslint @codeconv/eslint-config-base
```

## Usage

Add this to your .eslintrc file:

```json
{
  "extends": ["@codeconv/base"]
}
```

Note: We omitted the eslint-config- prefix since it is automatically assumed by ESLint.

## Rules

This config extends ['eslint:recommended'](https://github.com/eslint/eslint/blob/main/conf/eslint-recommended.js) and
['standard'](https://github.com/standard/eslint-config-standard/blob/master/.eslintrc.json). For available rules see:

- [ESLint Rules](https://eslint.org/docs/rules/)
- [JavaScript Standard Style Rules](https://standardjs.com/rules.html#rules)

### List of 'eslint:recommended' rules not presented in the 'standard'

| Rule                                                                                     | Value     |
| ---------------------------------------------------------------------------------------- | --------- |
| [for-direction](https://eslint.org/docs/rules/for-direction)                             | `"error"` |
| [getter-return](https://eslint.org/docs/rules/getter-return)                             | `"error"` |
| [no-dupe-else-if](https://eslint.org/docs/rules/no-dupe-else-if)                         | `"error"` |
| [no-extra-semi](https://eslint.org/docs/rules/no-extra-semi)                             | `"error"` |
| [no-inner-declarations](https://eslint.org/docs/rules/no-inner-declarations)             | `"error"` |
| [no-nonoctal-decimal-escape](https://eslint.org/docs/rules/no-nonoctal-decimal-escape)   | `"error"` |
| [no-setter-return](https://eslint.org/docs/rules/no-setter-return)                       | `"error"` |
| [no-unsafe-optional-chaining](https://eslint.org/docs/rules/no-unsafe-optional-chaining) | `"error"` |
| [no-unused-labels](https://eslint.org/docs/rules/no-unused-labels)                       | `"error"` |
| [require-yield](https://eslint.org/docs/rules/require-yield)                             | `"error"` |

### List of 'eslint:recommended' rules overridden in the 'standard'

| Rule                                                                         | 'eslint:recommended' | 'standard'                                                                                       |
| ---------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| [no-constant-condition](https://eslint.org/docs/rules/no-constant-condition) | `"error"`            | `["error", { "checkLoops": false }]`                                                             |
| [no-empty](https://eslint.org/docs/rules/no-empty)                           | `"error"`            | `["error", { "allowEmptyCatch": true }]`                                                         |
| [no-redeclare](https://eslint.org/docs/rules/no-redeclare)                   | `"error"`            | `["error", { "builtinGlobals": false }]`                                                         |
| [no-self-assign](https://eslint.org/docs/rules/no-self-assign)               | `"error"`            | `["error", { "props": true }]`                                                                   |
| [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars)               | `"error"`            | `["error", {"args": "none", "caughtErrors": "none", "ignoreRestSiblings": true, "vars": "all"}]` |
| [use-isnan](https://eslint.org/docs/rules/use-isnan)                         | `"error"`            | `["error", {"enforceForSwitchCase": true, "enforceForIndexOf": true}]`                           |
| [valid-typeof](https://eslint.org/docs/rules/valid-typeof)                   | `"error"`            | `["error", { "requireStringLiterals": true }]`                                                   |

### List of 'standard' rules overridden in the '@codeconv/base'

| Rule                                                                             | 'eslint:recommended'                                                                                               | 'standard'                                                                                                                                                                           |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [brace-style](https://eslint.org/docs/rules/brace-style)                         | `["error", "1tbs", { "allowSingleLine": true }]`                                                                   | `["error", "1tbs", { "allowSingleLine": false }]`                                                                                                                                    |
| [comma-dangle](https://eslint.org/docs/rules/comma-dangle)                       | `["error", {"arrays": "never", "objects": "never", "imports": "never", "exports": "never", "functions": "never"}]` | `["error", {"arrays": "always-multiline", "objects": "always-multiline", "imports": "always-multiline", "exports": "always-multiline", "functions": "always-multiline"}]`            |
| [object-curly-newline](https://eslint.org/docs/rules/object-curly-newline)       | `["error", { "multiline": true, "consistent": true }]`                                                             | `["error", {"ObjectExpression": {"minProperties":1}, "ObjectPattern": {"multiline":true}, "ImportDeclaration":"never", "ExportDeclaration": {"multiline":true, "minProperties":1}}]` |
| [object-property-newline](https://eslint.org/docs/rules/object-property-newline) | `["error", { "allowMultiplePropertiesPerLine": true }]`                                                            | `["error", {"allowAllPropertiesOnSameLine":false}]`                                                                                                                                  |
