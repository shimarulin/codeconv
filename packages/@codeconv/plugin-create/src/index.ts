import type { ArgumentsCamelCase, CommandModule } from 'yargs'
import inquirer from 'inquirer'
import { resolveModuleList } from '@codeconv/packages-resolver'

const { prompt } = inquirer

export interface TemplateArgs {
  name: string
}

export type TemplateRender = (args: TemplateArgs) => void

export interface TemplateModule {
  name: string
  description: string
  render: TemplateRender
}

export interface CreateCommandArguments {
  name?: string;
}

const validateTemplateModule = (templateModule: TemplateModule): boolean => {
  return ('render' in templateModule && typeof templateModule.render === 'function')
}

async function getName (name?:string) {
  return name
    ? Promise.resolve(name)
    : prompt<{name: string}>([
      {
        name: 'name',
        message: 'Enter package name',
        type: 'input',
      },
    ]).then(({ name }) => name)
}

async function getModules (global?: boolean) {
  return resolveModuleList<TemplateModule>([
    '**/@codeconv/template-*',
    '**/codeconv-plugin-*',
  ], global)
    .then((resolvedModules) => resolvedModules.filter(validateTemplateModule))
}

const commandModule: CommandModule = {
  command: 'create [name]',
  describe: 'Create standard project or package from template',
  builder: {},
  handler: async (args: ArgumentsCamelCase<CreateCommandArguments>) => {
    /**
     * 0. [ ] get context
     * 1. [x] find templates by pattern ['**\/@codeconv/template-*', '**\/codeconv-template-*']
     * 2. [ ] if (context.monorepo) { select package template } else { select project template }
     * 3. [x] pass control to the template module
     *
     * template module uses generators:
     *  - generator-manifest (package.json) - can be extended for template, ask questions:
     *    - name
     *    - description
     *    - license
     *  - generator-license, ask questions:
     *    - license (or reused from 'generator-manifest')
     *  - generator-readme, ask questions:
     *    - name (or reused from 'generator-manifest')
     *    - description (or reused from 'generator-manifest')
     * */

    // TODO: get context
    const [
      templateModules,
      name,
    ] = await Promise.all([
      getModules(false),
      getName(args.name),
    ])

    const resolvedArgs: TemplateArgs = {
      ...args,
      name,
    }

    if (templateModules.length === 1) {
      templateModules[0].render(resolvedArgs)
    } else if (templateModules.length > 1) {
      await prompt<{template: TemplateModule}>([
        {
          name: 'template',
          message: 'Select the template',
          type: 'list',
          choices: templateModules.map((templateModule) => {
            return {
              name: `${templateModule.name} > ${templateModule.description || ''}`,
              value: templateModule,
            }
          }),
        },
      ]).then(({ template }) => {
        template.render(resolvedArgs)
      })
    } else {
      console.log('No template installed')
    }
  },
}

export default commandModule
