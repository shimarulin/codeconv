# `@codeconv/cox`

> CodeConv CLI

## Install

Using npm:

```bash
npm install @codeconv/cox
```

or using yarn:

```bash
yarn add @codeconv/cox
```

## Usage

```bash
# Create new project or package (used globally or in monorepo, can be installed as global)
cox create <pkg-name>

# Extend existing package with functionality template provided by cox-<template-name>-template (can be used in all projects, can be installed as global or loaded from npm)
cox append <template>
cox extends <template>

# Add local package as dependency (used in monorepo)
cox add <pkg-name> [--to <scope>]

# Create new release (used in all projects)
cox release
```

## License

[MIT](LICENSE)
