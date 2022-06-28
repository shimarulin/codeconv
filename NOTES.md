# Development notes

## WebStorm tips

### Fix EJS indentation

.idea/codeStyles/codeStyleConfig.xml

```xml
<component name="ProjectCodeStyleConfiguration">
  <state>
    <option name="USE_PER_PROJECT_SETTINGS" value="true" />
  </state>
</component>
```

.idea/codeStyles/Project.xml

```xml
<component name="ProjectCodeStyleConfiguration">
  <code_scheme name="Project" version="173">
    <option name="AUTODETECT_INDENTS" value="false" />
    <option name="OTHER_INDENT_OPTIONS">
      <value>
        <option name="INDENT_SIZE" value="2" />
        <option name="TAB_SIZE" value="2" />
      </value>
    </option>

    <codeStyleSettings language="EJS">
      <indentOptions>
        <option name="INDENT_SIZE" value="2" />
      </indentOptions>
    </codeStyleSettings>
  </code_scheme>
</component>
```

## Цели и процессы

Цель -> подцели -> процессы -> перечень необходимых действий -> инструменты -> решения

Основная цель проекта - единообразная и согласованная структура проектов, стиля кода и организация процессов.

### Структура проектов

#### Вводные

Процесс: создание пакетов(проектов) и частей проектов. Унификация достигается за счет шаблонов, построенных с учетом
соглашений.

Действия: создать каталог с общими файлами, наполнить эти файлы содержимым, специфичным для проекта.

Инструменты:

#### Yarn (пустой каталог):

```bash
yarn init v1.21.1
question name (yarn-init):
question version (1.0.0):
question description:
question entry point (index.js):
question repository url:
question author:
question license (MIT):
question private:
success Saved package.json
```

```json
{
  "name": "yarn-init",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

#### NPM

```bash
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (yarn-init)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /home/shimarulin/Проекты/Личные/Experiments/yarn-init/package.json:

{
  "name": "yarn-init",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this OK? (yes)
```

#### Анализ

И Yarn, и NPM инициализируют пакет в текущем каталоге. Нужно создать каталог, затем ввести команду инициализации.
Альтернатива: задать название каталога в параметре инициализации (менее трудозатратно). При создании пакета обязательным
является создание `package.json`. И Yarn, и NPM обязательно запрашивают название репозитория, если он еще не создан. Так
как ни пакет и ни каталог еще не созданы, то в случае с отдельным пакетом он не будет иметь проинициализированного `git`
и `origin`. соответственно вопрос остается актуальным. Название пакета необязательно - может быть взято из `origin`. В
случае с моно-репозиторием `origin` берется из корневого пакета. Название пакета необходимо. Поведение должно зависеть
от контекста.

#### Решения

Всегда создается новый каталог - вариант инициализации в текущем каталоге отбрасываем. Создание, а не инициализация.

ввести команду создания пакета:

- если каталог содержит монорепозиторий - предложить ввести имя пакета (если не задано как опция, для унификации можно
  отказаться от этого)
- если каталог не содержит монорепозиторий - предложить ввести `origin` (смысл ввода имени пакета сомнителен, так как
  его можно получить из `origin`, по тем же причинам нет смысла задавать как опцию)

Однако такие инструменты как _Sao_ требуют ввода названия каталога(пакета), в противном случае произойдет инициализация
в текущем каталоге. Но это поведение можно изменить https://github.com/saojs/sao/issues/130

Sao можно завернуть в обертку, которая будет предоставлять несколько стандартных команд (алиасов), для упрощения
взаимодействия. Можно использовать отдельные шаблоны для создания пакетов (возникает вопрос разделения общих частей)

#### Референсы

- https://github.com/lassjs/lass

#### Инструменты

- https://saojs.org/

#### Процесс для отдельного пакета

- команда создания
