# `@codeconv/plugin-create`

> CodeConv 'create' command plugin

## Install

Using npm:

```bash
npm install @codeconv/plugin-create
```

or using yarn:

```bash
yarn add @codeconv/plugin-create
```

## Development notes

### TODO

#### Git hooks setup

The 'prepare' script can be replaced with the @codeconv plugin (@codeconv/plugin-git-hooks)

```json
{
  "scripts": {
    "prepare": "[ -d \".git\" ] && git config core.hooksPath .hooks"
  }
}
```

### Project templating

- A filename beginning with `__` excludes it from the monorepo subpackage.
- Config files use JSON format by default to simplifying parse and change configuration with other tools.

## External tools

- https://commitlint.js.org/#/
  - https://github.com/conventional-changelog/commitlint#config
- https://prettier.io/
  - https://github.com/matzkoh/prettier-plugin-packagejson

Git hooks:

- https://git-scm.com/docs/githooks
- https://prettier.io/docs/en/precommit.html#option-5-shell-script

## License

[MIT](LICENSE)
