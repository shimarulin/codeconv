# `@codeconv/mkpkg`

> codeconv scaffolding tool to make a node module

- [Usage](#usage)
- [Commands](#commands)

## Usage

Use as [SAO](https://github.com/saojs/sao) generator:

```bash
npx sao npm:@codeconv/mkpkg
```

Alternatively you can install `@codeconv/mkpkg` to use as CLI tool from NPM:

```bash
npm install -g @codeconv/mkpkg
```

Then try the command `mkpkg --help` in your terminal, if everything works fine you'd see the CLI usages.

```sh-session
$ mkpkg --help
cli.js v0.6.1

Usage:
  $ cli.js [directory]

Commands:
  [directory]  Generate a new project to target directory. If you omit "directory",
               new project will be generated in the current directory

For more info, run any command with the `--help` flag:
  $ cli.js --help

Options:
  --log          Print actions log
  -h, --help     Display this message
  -v, --version  Display version number
```

## Commands

- [`mkpkg [directory]`](#mkpkg-directory)

### `mkpkg [directory]`

Generate a new project to target directory. If you omit "directory", new project will be generated in the current
directory.

```
Usage:
  $ cli.js [directory]

Commands:
  [directory]  Generate a new project to target directory. If you omit "directory",
               new project will be generated in the current directory

For more info, run any command with the `--help` flag:
  $ cli.js --help

Options:
  --log          Print actions log
  -h, --help     Display this message
  -v, --version  Display version number
```
