# Prompts

## Examples

### [Prompts](https://github.com/terkelg/prompts) example

```typescript
import * as prompts from 'prompts'
import { PromptObject, Choice } from 'prompts'
import { licenseMap } from '@codeconv/license'

type ProjectType = 'single' | 'monorepo' | 'package'

export interface PromptOverrides {
  type?: ProjectType;
  origin?: string;
  version?: string;
  namespace?: string;
}

export interface PromptDefaults {
  name?: string;
  author?: string;
  email?: string;
  license?: string;
  version?: string;
}

export interface PromptContext {
  namespaces?: string[];
}

export interface Answers extends Required<PromptOverrides>, Required<PromptDefaults> {
  description: string;
}

type AddCommandAnswerKeys = Extract<keyof Answers, string>

const licenseChooseList: Choice[] = Object.keys(licenseMap).map((key) => ({
  title: `${key} - ${licenseMap[key].name}`,
  value: key,
}))

export const runPrompts = async (overrides: PromptOverrides, defaults: PromptDefaults, context: PromptContext): Promise<Answers> => {
  prompts.override(overrides)

  const { namespace } = await prompts([
    {
      type: 'select',
      name: 'namespace',
      message: 'Select the namespace',
      choices: context.namespaces?.map((ns): Choice => ({
        title: ns,
        value: ns,
      })),
    },
  ])

  const questions: Array<PromptObject<AddCommandAnswerKeys>> = [
    {
      type: 'select',
      name: 'type',
      message: 'Project type',
      choices: [
        {
          title: 'Single',
          value: 'single',
        },
        {
          title: 'Monorepo',
          value: 'monorepo',
        },
      ],
    },
    {
      type: 'text',
      name: 'name',
      message: `Project name${namespace ? ` in "${namespace}" namespace` : ''}`,
      initial: defaults.name,
      validate (prev): boolean {
        return prev.length > 0
      },
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description',
    },
    {
      type: 'text',
      name: 'version',
      message: 'Project version',
      initial: defaults.version,
    },
    {
      type: 'text',
      name: 'author',
      message: 'Author name',
      initial: defaults.author,
    },
    {
      type: 'text',
      name: 'email',
      message: 'Author email',
      initial: defaults.email,
    },
    {
      type: 'text',
      name: 'origin',
      message: 'Git origin URL',
    },
    {
      type: 'autocomplete',
      name: 'license',
      message: 'Choose a license',
      initial: defaults.license,
      choices: licenseChooseList,
    },
  ]

  const answers = await prompts(questions)

  return {
    namespace,
    ...answers,
  }
}
```

### [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) example

```typescript
import {prompt, ListChoiceOptions, ListQuestion, InputQuestion, Answers} from 'inquirer'
import { licenseMap } from '@codeconv/license'

export type ProjectType = 'single' | 'monorepo' | 'package'

export interface PromptOverrides {
  type?: ProjectType;
  origin?: string;
  version?: string;
  namespace?: string;
}

export interface PromptDefaults {
  name?: string;
  author?: string;
  email?: string;
  license?: string;
  version?: string;
}

export interface PromptContext {
  namespaces?: string[];
}

export interface PromptAnswers extends Required<PromptOverrides>, Required<PromptDefaults> {
  description: string;
}

const licenseChoiceList: ListChoiceOptions[] = Object.keys(licenseMap).map((key) => ({
  name: `${key} - ${licenseMap[key].name}`,
  value: key,
}))

export const runPrompts = async (overrides: PromptOverrides, defaults: PromptDefaults, context: PromptContext): Promise<PromptAnswers> => {
  const type: ListQuestion = {
    type: 'list',
    name: 'type',
    message: 'Project type',
    choices: [
      {
        name: 'Single',
        value: 'single',
      },
      {
        name: 'Monorepo',
        value: 'monorepo',
      },
    ],
    when: !overrides.type,
  }

  const namespace: ListQuestion = {
    type: 'list',
    name: 'namespace',
    message: 'Select the namespace',
    choices: context.namespaces?.map((ns): ListChoiceOptions => ({
      name: ns,
      value: ns,
    })),
    when: !overrides.namespace,
  }

  const name: InputQuestion = {
    type: 'input',
    name: 'name',
    message: 'Project name',
    default: defaults.name,
  }

  const description: InputQuestion = {
    type: 'input',
    name: 'description',
    message: 'Project description',
  }

  const version: InputQuestion = {
    type: 'input',
    name: 'version',
    message: 'Project version',
    default: defaults.version,
    when: !overrides.version,
  }

  const author: InputQuestion = {
    type: 'input',
    name: 'author',
    message: 'Author name',
    default: defaults.author,
  }

  const email: InputQuestion = {
    type: 'input',
    name: 'email',
    message: 'Author email',
    default: defaults.email,
  }

  const origin: InputQuestion = {
    type: 'input',
    name: 'origin',
    message: 'Git origin URL',
    when: !overrides.origin,
  }

  // TODO: add autocomplete
  const license: ListQuestion = {
    type: 'list',
    name: 'license',
    message: 'Choose a license',
    choices: licenseChoiceList,
  }

  const answers = await prompt<PromptAnswers>([
    type,
    namespace,
    name,
    description,
    version,
    author,
    email,
    origin,
    license,
  ])

  return {
    ...overrides,
    ...answers,
  }
}
```
