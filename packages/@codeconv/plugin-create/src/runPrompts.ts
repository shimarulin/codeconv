import * as prompts from 'prompts'
import { PromptObject, Choice, PromptType } from 'prompts'
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

export interface PromptData {
  namespaces?: string[];
}

export interface Answers extends Required<PromptOverrides>, Required<PromptDefaults> {
  description: string;
  publish: boolean;
}

type AddCommandAnswerKeys = Extract<keyof Answers, string>

const licenseChooseList: Choice[] = Object.keys(licenseMap).map((key) => ({
  title: `${key} - ${licenseMap[key].name}`,
  value: key,
}))

export const runPrompts = async (overrides: PromptOverrides, defaults: PromptDefaults, data: PromptData): Promise<Answers> => {
  prompts.override(overrides)

  const { namespace } = await prompts([
    {
      type: data.namespaces ? 'select' : null,
      name: 'namespace',
      message: 'Select the namespace',
      choices: data.namespaces?.map((ns): Choice => ({
        title: ns,
        value: ns,
      })),
    },
  ])

  const questions: Array<PromptObject<AddCommandAnswerKeys>> = [
    {
      type: 'select',
      name: 'type',
      message: 'Package type',
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
      message: `Package name${namespace ? ` in "${namespace}" namespace` : ''}`,
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
    {
      type: (prev, values): PromptType | null => values.type !== 'monorepo' ? 'toggle' : null,
      name: 'publish',
      message: 'Do you want to publish package?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    },
  ]

  const answers = await prompts(questions)

  return {
    namespace,
    ...answers,
  }
}
