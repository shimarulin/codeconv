import type { ArgumentsCamelCase, CommandModule } from 'yargs'
import inquirer from 'inquirer'
import { resolveModuleList } from '@codeconv/packages-resolver'

const { prompt } = inquirer

export interface TemplateArgs {
  name?: string
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

// const validateTemplateModule = (templateModule: TemplateModule): boolean => {
//   return ('render' in templateModule && typeof templateModule.render === 'function')
// }

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
    const templateModules = await resolveModuleList<TemplateModule>([
      '**/@codeconv/template-*',
      '**/codeconv-plugin-*',
    ], false)

    // const templateModules = await getModuleListOld<TemplateModule>(templateMetaInfoList)

    // const validTemplateModules = templateModules
    //   .filter((templateModule, index) => {
    //     const isTemplateModuleValid = validateTemplateModule(templateModule.module)
    //
    //     if (!isTemplateModuleValid) {
    //       console.info(`Template "${templateModule.manifest.name}" has incompatible format`)
    //     }
    //
    //     return isTemplateModuleValid
    //   })
    //

    if (templateModules.length === 1) {
      templateModules[0].render(args)
    } else if (templateModules.length > 1) {
      const selectedTemplateModule = await prompt<{template: TemplateModule}>([
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
      ])

      selectedTemplateModule.template.render(args)
    } else {
      console.log('No template installed')
    }
  },
}

export default commandModule
