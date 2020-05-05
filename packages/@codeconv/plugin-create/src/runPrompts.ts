import * as prompts from 'prompts'
import { PromptObject, Choice } from 'prompts'
import { licenseMap } from '@codeconv/license'

type ProjectType = 'single' | 'monorepo' | 'package'

export interface Overrides {
  type?: ProjectType;
  origin?: string;
  version?: string;
}

export interface Defaults {
  name?: string;
  author?: string;
  email?: string;
  license?: string;
  version?: string;
}

export interface Answers extends Required<Overrides>, Required<Defaults> {
  description: string;
}

type AddCommandAnswerKeys = Extract<keyof Answers, string>

const licenseChooseList: Choice[] = Object.keys(licenseMap).map((key) => ({
  title: `${key} - ${licenseMap[key].name}`,
  value: key,
}))

export const runPrompts = async (overrides: Overrides, defaults: Defaults): Promise<Answers> => {
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
      message: 'Project name',
      initial: defaults.name,
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

  prompts.override(overrides)

  return prompts(questions)
}
