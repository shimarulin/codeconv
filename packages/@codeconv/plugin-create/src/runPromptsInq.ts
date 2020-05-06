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
