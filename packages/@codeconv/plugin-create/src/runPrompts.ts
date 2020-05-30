import { prompt, ListChoiceOptions, ListQuestion, InputQuestion, ConfirmQuestion } from 'inquirer'
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

export interface PromptData {
  namespaces?: string[];
}

export interface Answers extends Required<PromptOverrides>, Required<PromptDefaults> {
  description: string;
  publish: boolean;
}

const licenseChoiceList: ListChoiceOptions[] = [
  'AGPL-3.0',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-2-Clause-FreeBSD',
  'BSD-3-Clause',
  'BSD-4-Clause',
  'GPL-2.0',
  'GPL-2.0+',
  'GPL-3.0',
  'GPL-3.0+',
  'ISC',
  'LGPL-2.1',
  'LGPL-2.1+',
  'LGPL-3.0',
  'LGPL-3.0+',
  'MIT',
  'MPL-2.0',
  'Unlicense',
]
  .map((key) => ({
    name: `${key} - ${licenseMap[key].name}`,
    value: key,
  }))

export const runPrompts = async (overrides: PromptOverrides, defaults: PromptDefaults, data: PromptData): Promise<Answers> => {
  const namespace: ListQuestion = {
    type: 'list',
    name: 'namespace',
    message: 'Select the namespace',
    choices: data.namespaces ? data.namespaces.map((ns): ListChoiceOptions => ({
      name: ns,
      value: ns,
    })) : [],
    when: !overrides.namespace,
  }

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

  const name: InputQuestion = {
    type: 'input',
    name: 'name',
    message (answers) {
      return `${answers.type ? 'Project' : 'Package'} name${answers.namespace ? ` in "${answers.namespace}" namespace` : ''}`
    },
    default: defaults.name,
    validate (input): boolean {
      return input.length > 0
    },
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
    default: defaults.license,
  }

  // TODO: add prompt
  const publish: ConfirmQuestion = {
    type: 'confirm',
    name: 'publish',
    message: 'Do you want to publish package?',
    default: true,
    when (answers) {
      return answers.type !== 'monorepo'
    },
  }

  const answers = await prompt<Answers>([
    namespace,
    type,
    name,
    description,
    version,
    author,
    email,
    origin,
    license,
    publish,
  ])

  return {
    ...overrides,
    ...answers,
  }
}
