# Разработка NPM-пакетов

## ECMAScript модули

### Расширения файлов обязательны

Согласно параграфу [Mandatory file extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions) для импорта в
ECMAScript модулях теперь необходимо указывать полный путь к файлу, включая расширение файла. То же самое относится к
индексным файлам каталогов (`'./index.js'`). Для проектов на TypeScript, компилируемых с помощью `tsc`, на момент
написания, это привело к неожиданному эффекту: необходимо указывать путь к получаемому JavaScript-файлу, вместо пути к
исходному TypeScript-файлу.

```ts
/**
 * Use '.js' extension instead '.ts'
 * The example below will import code from the './someTypeScriptFunction.ts' file
 * */
import { someTypeScriptFunction } from './someTypeScriptFunction.js'
```
