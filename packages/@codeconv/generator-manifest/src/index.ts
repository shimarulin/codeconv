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

const { prompt } = inquirer

export const generate = (input: ManifestInput): Manifest => {
  const name = input.name || 'name'
  const version = input.version || '1.0.0'

  const description: InputQuestion = {
    type: 'input',
    name: 'description',
    message: 'Project description',
  }

  return {
    name,
    version,
  }
}

export default {
  generate,
}
