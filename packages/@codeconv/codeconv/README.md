# `@codeconv/codeconv`

> CodeConv CLI core

## Installation

### Global installation

Using npm:

```bash
npm install -g @codeconv/codeconv
```

or using yarn:

```bash
yarn global add @codeconv/codeconv
```

### Installation per project

With npm:

```bash
npm install @codeconv/codeconv
```

or with yarn:

```bash
yarn add @codeconv/codeconv
```

## Usage

CodeConv CLI can be extended with plugins. The CodeConv plugin system automatically resolves plugins by following this
naming convention:

- `@codeconv/plugin-*`
- `codeconv-plugin-*`

It looks for plugins in the global NPM scope when creating a new project, and in the local NPM scope for existing
projects.

## Plugin development

Example of a module with a named export:

```ts
export const command = 'command [arg]'
export const describe = 'Command example'

export const builder: { [key: string]: Options } = {}

export const handler = ({ pkg }: Arguments<CreateCommandArguments>): void => {
  console.log(pkg)
}
```

Example of a module with a default export:

```ts
const commandModule: CommandModule = {
  command: 'command [arg]',
  describe: 'Command example',
  builder: {},
  handler: (args) => {
    console.log(args)
  },
}

export default commandModule
```

## License

[MIT](LICENSE)
