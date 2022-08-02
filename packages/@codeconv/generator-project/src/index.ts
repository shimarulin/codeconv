import inquirer from 'inquirer'
import type { InputQuestion } from 'inquirer'

export interface ManifestInput {
  name?: string
  version?: string
}

export interface Manifest {
  name: string
  version: string
}

export interface ManifestDefaults {
  name?: string;
  author?: string;
  email?: string;
  // license?: string;
  version?: string;
}

export interface ManifestAnswers extends Required<ManifestDefaults> {
  description: string;
  // publish: boolean;
}

const { prompt } = inquirer

export const askQuestions = async (defaults: ManifestDefaults): Promise<ManifestAnswers> => {
  // const name = input.name || 'name'
  // const version = input.version || '1.0.0'

  const name: InputQuestion<ManifestAnswers> = {
    type: 'input',
    name: 'name',
    // message (answers) {
    //   return `${answers.type ? 'Project' : 'Package'} name${answers.namespace ? ` in "${answers.namespace as string}" namespace` : ''}`
    // },
    default: defaults.name,
    validate (input: string): boolean {
      // see rules from https://docs.npmjs.com/cli/v8/configuring-npm/package-json#name
      return input.length > 0 && input.length <= 214
    },
  }

  const description: InputQuestion<ManifestAnswers> = {
    type: 'input',
    name: 'description',
    message: 'Project description',
  }

  const version: InputQuestion<ManifestAnswers> = {
    type: 'input',
    name: 'version',
    message: 'Project version',
    default: defaults.version,
    // when: !overrides.version,
  }

  const author: InputQuestion<ManifestAnswers> = {
    type: 'input',
    name: 'author',
    message: 'Author name',
    default: defaults.author,
  }

  const email: InputQuestion<ManifestAnswers> = {
    type: 'input',
    name: 'email',
    message: 'Author email',
    default: defaults.email,
  }

  const answers = await prompt<ManifestAnswers>([
    // namespace,
    // type,
    name,
    description,
    version,
    author,
    email,
    // origin,
    // license,
    // publish,
  ])

  return {
    ...answers,
  }
}

export default {
  askQuestions,
}
