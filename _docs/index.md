# codeconv

> The development standards and workflow

## Git hooks

- https://github.com/typicode/husky - настройка и установка хуков
- https://github.com/okonet/lint-staged - запуск команд только для измененных файлов

## Print Yargs help

```typescript
import * as yargs from 'yargs'

const program = yargs.command(require('./commands/add'))

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
program.showHelp((helpText: string): void => {
  console.log('Get help text')
  console.log(helpText)
})

program.parse()
```
